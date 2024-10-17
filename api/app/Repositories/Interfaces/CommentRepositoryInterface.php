<?php

namespace App\Repositories\Interfaces;

interface CommentRepositoryInterface
{
    public function getCommentsByTask($taskId);
    public function createComment(array $data);
    public function updateComment($id, array $data);
    public function deleteComment($id);
}