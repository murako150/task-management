<?php

namespace App\Http\Controllers;

use App\Models\UserAccount;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserAccountController extends Controller
{
    // ユーザー一覧の取得（管理者とクライアント用）
    public function index()
    {
        $currentUser = Auth::user();

        // 管理者はすべてのユーザーを取得、クライアントは一般ユーザーのみ取得
        if ($currentUser->role === 'admin') {
            $users = UserAccount::all(); // 削除フラグのないユーザー
        } elseif ($currentUser->role === 'client') {
            $users = UserAccount::where('role', 'user')
                                ->where('deleted_flag', 0) // 削除フラグのない一般ユーザー
                                ->get();
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($users);
    }

    public function show($id)
    {
        $user = UserAccount::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    // ユーザーの作成
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|unique:user_accounts,user_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:user_accounts,email',
            'role' => 'required|in:admin,client,user',
            'password' => 'required|string|min:8',
        ]);

        $currentUser = Auth::user();

        // クライアントは一般ユーザーのみ作成可能
        if ($currentUser->role === 'client' && $request->role !== 'user') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // ユーザーを作成
        $user = UserAccount::create([
            'user_id' => $request->user_id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'active_flag' => 1, // デフォルトで有効
            'deleted_flag' => 0,
        ]);

        return response()->json($user, 201);
    }


    public function addUser(Request $request)
    {
        // ログイン中のユーザーを取得
        $loggedInUser = auth()->user();

        // 管理者であれば、全てのユーザーを追加できる
        if ($loggedInUser->role === 'admin') {
            $this->validate($request, [
                'user_id' => 'required|unique:user_accounts,user_id',
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:user_accounts',  // user_accounts テーブルで一意チェック
                'password' => 'required|string|min:8',
                'role' => 'required|in:admin,client,user',  // 管理者は全てのロールを選べる
            ]);
        }

        // クライアントであれば、一般ユーザーのみ追加できる
        else if ($loggedInUser->role === 'client') {
            $this->validate($request, [
                'user_id' => 'required|unique:user_accounts,user_id',
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:user_accounts',  // user_accounts テーブルで一意チェック
                'password' => 'required|string|min:8',
                'role' => 'required|in:user',  // クライアントは一般ユーザーのみ追加できる
            ]);
        }

        // 新しいユーザーを作成
        $user = UserAccount::create([
            'user_id' => $request->user_id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
            'deleted_flag' => false,  // 初期値で削除フラグは false
            'active_flag' => true,  // 初期値でアクティブ
        ]);

        return response()->json(['message' => 'ユーザーが追加されました', 'user' => $user]);
    }

    // ユーザーの編集
    public function update(Request $request, $id)
    {
        // IDが1のユーザーを無効にさせない
        if ($id == 1 && isset($request->active_flag) && $request->active_flag == 0) {
            return response()->json(['message' => 'Cannot deactivate this user'], 403);
        }

        $user = UserAccount::find($id);  // ユーザーの検索
        $currentUser = Auth::user();  // 現在のログインユーザー
    
        // $currentUser または $user が null の場合の処理
        if (!$currentUser) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // 管理者のみ他のユーザー情報を編集可能
        if ($currentUser->role !== 'admin' && $currentUser->id !== (int)$id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // バリデーション
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:user_accounts,email,'.$id,
            'password' => 'sometimes|nullable|string|min:8',
            'active_flag' => 'sometimes|boolean',
        ]);
    
        // ロールの変更は許可しない
        $validated = collect($validated)->except('role')->toArray();
    
        // パスワードの更新が必要な場合のみハッシュ化
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);  // パスワードが空の場合は更新しない
        }
    
        // ユーザー情報を更新
        $user->update($validated);
    
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    // ユーザーの削除（削除フラグを立てる）
    public function destroy($id)
    {
        $user = UserAccount::findOrFail($id);
        if ($id == 1) {
            return response()->json(['message' => 'Cannot delete this user'], 403);
        }
        // 管理者のみ削除可能
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // 削除フラグを立てる
        $user->update(['deleted_flag' => 1]);
    
        return response()->json(['message' => 'User marked as deleted']);
    }

    // クライアント一覧の取得
    public function getClients()
    {
        // クライアント（role が client）のユーザーのみを取得
        $clients = UserAccount::where('role', 'client')->get();
        return response()->json($clients);
    }

    // プロジェクトに追加されていないユーザーを取得
    public function getAvailableUsersForProject($projectId)
    {
        // プロジェクトのユーザーを取得
        $project = Project::findOrFail($projectId);
        $projectUsers = $project->users()->pluck('user_accounts.id')->toArray(); // user_accounts.id を指定

        // 追加されていないユーザーを取得し、条件を追加
        $availableUsers = UserAccount::whereNotIn('id', $projectUsers)
            ->where('active_flag', 1) // アクティブなユーザーのみ
            ->where('deleted_flag', 0) // 削除されていないユーザーのみ
            ->whereNotIn('role', ['admin', 'client']) // admin と client を除外
            ->get();

        return response()->json($availableUsers);
    }

    public function getTasks()
    {
        $user = Auth::user();
        $tasks = Task::where('user_id', $user->id)->get(); // ユーザーのタスクを取得
        return response()->json($tasks);
    }
    public function getUserTasks()
    {
        $user = Auth::user(); // 認証されたユーザーを取得
        $tasks = $user->tasks; // ユーザーに関連するタスクを取得

        return response()->json($tasks); // タスクをJSON形式で返す
    }

}