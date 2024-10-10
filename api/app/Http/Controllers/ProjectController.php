<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    // プロジェクトの一覧を取得
    public function index()
    {
        $user = Auth::user();
        
        // 管理者は全てのプロジェクトを取得、それ以外はユーザーが参加しているプロジェクトを取得
        if ($user->role === 'admin') {
            $projects = Project::all();
        } else {
            // ユーザーがオーナーとして所有しているプロジェクトと参加しているプロジェクトを取得
            $ownedProjects = $user->ownedProjects()->get();
            $participatingProjects = $user->participatingProjects()->get();

            // 2つのコレクションをマージして1つのコレクションにする
            $projects = $ownedProjects->merge($participatingProjects);
        }

        return response()->json($projects);
    }

    // 特定のプロジェクトの詳細を取得
    public function show($id)
    {
        $project = Project::with('users')->findOrFail($id);
        return response()->json($project);
    }

    // 新しいプロジェクトを作成
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'owner_id' => 'required|exists:user_accounts,id',  // クライアントを選択する
        ]);

        // 管理者はフォームからowner_idを選択し、クライアントは自動的に自分のIDをowner_idに設定
        if (Auth::user()->role === 'admin') {
            $validatedData['owner_id'] = $request->input('owner_id');  // 管理者がクライアントを選択
        } else {
            $validatedData['owner_id'] = Auth::id();  // クライアントが自動的にオーナーになる
        }
        

        // プロジェクトを作成
        $project = Project::create($validatedData);

        return response()->json($project, 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        // クライアントがオーナーかどうか確認
        if (Auth::user()->id !== $project->owner_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);
    
        $project->update($validated);
        return response()->json($project);
    }
    
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        
        // クライアントがオーナーかどうか確認
        if (Auth::user()->id !== $project->owner_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $project->delete();
    
        return response()->json(['message' => 'Project deleted successfully']);
    }

    public function getProjectUsers($project_id)
    {
        $project = Project::findOrFail($project_id);
    
        // プロジェクトに参加しているユーザーを取得
        $users = $project->participants()->get();
    
        return response()->json($users);
    }

    public function addUserToProject(Request $request, $projectId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:user_accounts,id',
            'user_account_id' => 'required|exists:user_accounts,id',
        ]);
        
        // 認可: プロジェクトのオーナーまたは管理者か確認
        $project = Project::findOrFail($projectId);
        $user = Auth::user();
        
        if ($user->id !== $project->owner_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // プロジェクトにユーザーを追加
        $project->users()->attach($validated['user_id'], ['user_account_id' => $validated['user_account_id']]);
        
        return response()->json(['message' => 'ユーザーがプロジェクトに追加されました。']);
    }
}