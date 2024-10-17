<?php

namespace App\Services;

use App\Repositories\Interfaces\CommentRepositoryInterface;

class CommentService
{
    protected $commentRepository;

    public function __construct(CommentRepositoryInterface $commentRepository)
    {
        $this->commentRepository = $commentRepository;
    }

    public function getCommentsByTask($taskId)
    {
        return $this->commentRepository->getCommentsByTask($taskId);
    }

    public function createComment(array $data)
    {
        return $this->commentRepository->createComment($data);
    }

    public function updateComment($id, array $data)
    {
        return $this->commentRepository->updateComment($id, $data);
    }

    public function deleteComment($id)
    {
        return $this->commentRepository->deleteComment($id);
    }
}