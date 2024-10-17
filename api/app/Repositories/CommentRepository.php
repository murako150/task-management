<?php

namespace App\Repositories;

use App\Repositories\Interfaces\CommentRepositoryInterface;
use App\Models\Comment;

class CommentRepository implements CommentRepositoryInterface
{
    public function getCommentsByTask($taskId)
    {
        return Comment::where('task_id', $taskId)->with('user')->get();
    }

    public function createComment(array $data)
    {
        return Comment::create($data);
    }

    public function updateComment($id, array $data)
    {
        $comment = Comment::findOrFail($id);
        $comment->update($data);
        return $comment;
    }

    public function deleteComment($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();
        return true;
    }
}