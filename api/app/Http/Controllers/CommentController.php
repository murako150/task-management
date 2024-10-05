<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // タスクに関連するコメントの一覧を取得
    public function index($taskId)
    {
        try {
            // タスクの存在確認
            $task = Task::findOrFail($taskId);
    
            // コメントとユーザー情報を一緒に取得
            $comments = $task->comments()->with('user')->get();
    
            return response()->json($comments);
        } catch (\Exception $e) {
            \Log::error('コメント取得エラー', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'コメントの取得に失敗しました。'], 500);
        }
    }

    // コメントを新規作成
    public function store(Request $request, $taskId)
    {
        $validatedData = $request->validate([
            'comment' => 'required|string', // バリデーションでコメントが必須かつ文字列であることを確認
        ]);

        $user = Auth::user();

        try {
            $comment = Comment::create([
                'task_id' => $taskId,
                'user_id' => $user->id,
                'comment' => $validatedData['comment'], // 'comment' を保存
            ]);

            return response()->json($comment, 201);
        } catch (\Exception $e) {
            \Log::error('コメント作成エラー', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'コメントの作成に失敗しました。'], 500);
        }
    }

    // コメントの更新
    public function update(Request $request, $id)
    {
        try {
            $comment = Comment::findOrFail($id);
            $user = Auth::user();

            // 作成者以外が更新しようとした場合、エラーレスポンスを返す
            if ($comment->user_id !== $user->id) {
                return response()->json(['message' => '更新権限がありません。'], 403);
            }

            $validatedData = $request->validate([
                'comment' => 'required|string',
            ]);

            $comment->update($validatedData);

            return response()->json($comment);
        } catch (\Exception $e) {
            \Log::error('コメント更新エラー', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'コメントの更新に失敗しました。'], 500);
        }
    }

    // コメントを削除
    public function destroy($id)
    {
        try {
            $comment = Comment::findOrFail($id);
            $user = Auth::user();
            $task = $comment->task;
            $project = $task->project;

            // 削除権限を確認（コメントの作成者、プロジェクトのオーナー、または管理者のみ削除可能）
            if ($user->id !== $comment->user_id && $user->id !== $project->owner_id && $user->role !== 'admin') {
                return response()->json(['message' => '削除権限がありません。'], 403);
            }

            $comment->delete();

            return response()->json(['message' => 'コメントが正常に削除されました。']);
        } catch (\Exception $e) {
            \Log::error('コメント削除エラー', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'コメントの削除に失敗しました。'], 500);
        }
    }
}