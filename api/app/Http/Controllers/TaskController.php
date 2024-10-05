<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    // タスクの一覧を取得
    public function index()
    {
        $user = Auth::user();
    
        // 管理者の場合は全てのタスクを取得
        if ($user->role === 'admin') {
            $tasks = Task::all();
        } elseif ($user->role === 'client') {
            // クライアントの場合は、参加しているプロジェクト内のタスクを取得
            $tasks = Task::whereHas('project', function ($query) use ($user) {
                $query->where('owner_id', $user->id);
            })->get();
        } else {
            // 一般ユーザーの場合は、自分が担当しているタスクを取得
            $tasks = Task::where('assigned_to', $user->id)->get();
        }
    
        return response()->json($tasks);
    }

    // 特定のタスクの詳細を取得
    public function show($id)
    {
        $task = Task::findOrFail($id);
        $user = Auth::user();
    
        // プロジェクトのオーナーかどうかをチェック
        $isProjectOwner = $task->project->owner_id === $user->id;
    
        // 管理者、担当者、プロジェクトのメンバー、またはプロジェクトのオーナーであれば表示
        $isProjectMember = Project::where('id', $task->project_id)
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('user_accounts.id', $user->id);
            })->exists();
    
        if ($user->role !== 'admin' && $task->assigned_to !== $user->id && !$isProjectMember && !$isProjectOwner) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        return response()->json($task);
    }

    // 新しいタスクを作成
    public function store(Request $request)
    {
        $user = Auth::user();
    
        // 管理者またはプロジェクトオーナーかどうか確認
        $isProjectOwnerOrAdmin = Project::where('id', $request->project_id)
            ->where('owner_id', $user->id)
            ->exists() || $user->role === 'admin';
    
        // ユーザーが参加しているプロジェクトかどうか確認
        $isProjectMember = Project::where('id', $request->project_id)
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('user_accounts.id', $user->id);
            })->exists();
        
        // プロジェクトに参加していない、または管理者でもオーナーでもない場合はエラーを返す
        if (!$isProjectMember && !$isProjectOwnerOrAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // バリデーション
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'required|exists:user_accounts,id',
            'project_id' => 'required|exists:projects,id',
            'due_date' => 'nullable|date',
        ]);
    
        // タスクを作成
        $task = Task::create($validatedData);
    
        return response()->json($task, 201);
    }
    
    // 既存のタスクを更新
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        // バリデーション
        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:pending,in_progress,completed',
            'assigned_to' => 'nullable|exists:user_accounts,id',
            'project_id' => 'nullable|exists:projects,id', // プロジェクトIDのバリデーションを追加
            'due_date' => 'nullable|date',
        ]);

        // タスクを更新
        $task->update($validatedData);

        return response()->json($task);
    }

    // タスクを削除
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    // プロジェクトに関連するタスクを取得
    public function getTasksByProject($projectId)
    {
        // プロジェクトの存在確認
        $project = Project::findOrFail($projectId);

        // プロジェクトに関連するタスクを取得
        $tasks = Task::where('project_id', $project->id)->get();

        return response()->json($tasks);
    }

    public function getProjectUsers($projectId)
    {
        // プロジェクトの存在確認
        $project = Project::findOrFail($projectId);

        // プロジェクトに参加しているユーザーを取得
        $users = $project->users()->get();

        return response()->json($users);
    }

    public function addComment(Request $request, $taskId)
    {
        $request->validate([
            'comment' => 'required|string|max:255',
            'user_id' => 'required|integer', // user_idのバリデーションを追加
        ]);
    
        $comment = new Comment();
        $comment->comment = $request->comment;
        $comment->task_id = $taskId;
        $comment->user_id = $request->user_id; // user_idを設定
        $comment->save();
    
        return response()->json($comment, 201);
    }

    public function updateStatus(Request $request, $taskId)
    {
        $request->validate([
            'status' => 'required|string|in:pending,in_progress,completed',
        ]);
    
        $task = Task::findOrFail($taskId);
        $task->status = $request->status;
        $task->save();
    
        return response()->json(['message' => 'Task status updated successfully'], 200);
    }

    public function getComments($task_id)
    {
        // ここにコメントを取得するロジックを実装
        $comments = Comment::where('task_id', $task_id)->get();
        return response()->json($comments);
    }
}