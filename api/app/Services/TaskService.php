<?php

namespace App\Services;

use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class TaskService
{
    protected $taskRepository;

    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function getTasksForUser($user)
    {
        if ($user->role === 'admin') {
            return $this->taskRepository->getAll();
        } elseif ($user->role === 'client') {
            // クライアントの場合、参加しているプロジェクト内のタスクを取得
            return $this->taskRepository->getTasksByProjectOwner($user->id);
        } else {
            // 一般ユーザーの場合、自分が担当しているタスクを取得
            return $this->taskRepository->getTasksAssignedToUser($user->id);
        }
    }

    public function getTaskDetails($taskId, $user)
    {
        $task = $this->taskRepository->findById($taskId);

        // プロジェクトのオーナーかどうか確認
        $isProjectOwner = $task->project->owner_id === $user->id;

        // 管理者、担当者、プロジェクトのメンバー、またはプロジェクトのオーナーであれば許可
        $isProjectMember = $this->taskRepository->isUserProjectMember($task->project_id, $user->id);

        if ($user->role !== 'admin' && $task->assigned_to !== $user->id && !$isProjectMember && !$isProjectOwner) {
            return null; // 権限なし
        }

        return $task;
    }

    public function createTask(array $data, $user)
    {
        // プロジェクトのオーナーまたは管理者であることを確認
        $isProjectOwnerOrAdmin = Project::where('id', $data['project_id'])
            ->where('owner_id', $user->id)
            ->exists() || $user->role === 'admin';

        if (!$isProjectOwnerOrAdmin) {
            return null; // 権限なし
        }

        return $this->taskRepository->create($data);
    }

    public function createSubtask(array $data)
    {
        return $this->taskRepository->create($data);
    }

    public function updateTask($id, array $data)
    {
        return $this->taskRepository->update($id, $data);
    }

    public function deleteTask($id)
    {
        return $this->taskRepository->delete($id);
    }

    public function getTasksByProject($projectId)
    {
        return $this->taskRepository->getTasksByProject($projectId);
    }

    public function getProjectUsers($projectId)
    {
        return $this->taskRepository->getProjectUsers($projectId);
    }

    public function addCommentToTask($taskId, array $data)
    {
        return $this->taskRepository->addCommentToTask($taskId, $data);
    }

    public function updateTaskStatus($taskId, $status)
    {
        return $this->taskRepository->updateTaskStatus($taskId, $status);
    }

    public function getTaskComments($taskId)
    {
        return $this->taskRepository->getTaskComments($taskId);
    }
}