<?php
namespace App\Http\Controllers;

use App\Services\CommentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    // タスクに関連するコメントの一覧を取得
    public function index($taskId)
    {
        try {
            $comments = $this->commentService->getCommentsByTask($taskId);
            return response()->json($comments);
        } catch (\Exception $e) {
            return response()->json(['message' => 'コメントの取得に失敗しました。'], 500);
        }
    }

    // コメントを新規作成
    public function store(Request $request, $taskId)
    {
        $validatedData = $request->validate([
            'comment' => 'required|string',
        ]);

        $user = Auth::user();
        $data = [
            'task_id' => $taskId,
            'user_id' => $user->id,
            'comment' => $validatedData['comment'],
        ];

        try {
            $comment = $this->commentService->createComment($data);
            return response()->json($comment, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'コメントの作成に失敗しました。'], 500);
        }
    }

    // コメントの更新
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'comment' => 'required|string',
        ]);

        try {
            $comment = $this->commentService->updateComment($id, $validatedData);
            return response()->json($comment);
        } catch (\Exception $e) {
            return response()->json(['message' => 'コメントの更新に失敗しました。'], 500);
        }
    }

    // コメントを削除
    public function destroy($id)
    {
        try {
            $this->commentService->deleteComment($id);
            return response()->json(['message' => 'コメントが正常に削除されました。']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'コメントの削除に失敗しました。'], 500);
        }
    }
}