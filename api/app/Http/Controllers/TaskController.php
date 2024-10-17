<?php

namespace App\Http\Controllers;

use App\Services\TaskService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    // タスクの一覧を取得
    public function index()
    {
        $user = Auth::user();
        $tasks = $this->taskService->getTasksForUser($user);
        return response()->json($tasks);
    }

    // 特定のタスクの詳細を取得
    public function show($id)
    {
        $user = Auth::user();
        $task = $this->taskService->getTaskDetails($id, $user);
        if ($task === null) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($task);
    }

    // 新しいタスクを作成
    public function store(Request $request)
    {
        $user = Auth::user();
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'required|exists:user_accounts,id',
            'project_id' => 'required|exists:projects,id',
            'due_date' => 'nullable|date',
        ]);

        $task = $this->taskService->createTask($validatedData, $user);
        if ($task === null) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($task, 201);
    }

    // サブタスクの作成
    public function storeSubtask(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'assigned_to' => 'nullable|exists:user_accounts,id',
            'due_date' => 'required|date',
            'parent_id' => 'required|exists:tasks,id',
        ]);

        $task = $this->taskService->createSubtask($validated);
        return response()->json($task, 201);
    }

    // 既存のタスクを更新
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:pending,in_progress,completed',
            'assigned_to' => 'nullable|exists:user_accounts,id',
            'project_id' => 'nullable|exists:projects,id',
            'due_date' => 'nullable|date',
        ]);

        $task = $this->taskService->updateTask($id, $validatedData);
        return response()->json($task);
    }

    // タスクを削除
    public function destroy($id)
    {
        $this->taskService->deleteTask($id);
        return response()->json(['message' => 'Task deleted successfully']);
    }

    // プロジェクトに関連するタスクを取得
    public function getTasksByProject($projectId)
    {
        $tasks = $this->taskService->getTasksByProject($projectId);
        return response()->json($tasks);
    }

    // プロジェクトに参加しているユーザーを取得
    public function getProjectUsers($projectId)
    {
        $users = $this->taskService->getProjectUsers($projectId);
        return response()->json($users);
    }

    // タスクにコメントを追加
    public function addComment(Request $request, $taskId)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:255',
            'user_id' => 'required|integer',
        ]);

        $comment = $this->taskService->addCommentToTask($taskId, $validated);
        return response()->json($comment, 201);
    }

    // タスクのステータスを更新
    public function updateStatus(Request $request, $taskId)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,in_progress,completed',
        ]);

        $this->taskService->updateTaskStatus($taskId, $validated['status']);
        return response()->json(['message' => 'Task status updated successfully']);
    }

    // タスクに関連するコメントを取得
    public function getComments($taskId)
    {
        $comments = $this->taskService->getTaskComments($taskId);
        return response()->json($comments);
    }
}