<?php

namespace App\Repositories;

use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Models\Task;
use App\Models\Comment;
use App\Models\Project;

class TaskRepository implements TaskRepositoryInterface
{
    public function getAll()
    {
        return Task::all();
    }

    public function findById($id)
    {
        return Task::findOrFail($id);
    }

    public function create(array $data)
    {
        return Task::create($data);
    }

    public function update($id, array $data)
    {
        $task = Task::findOrFail($id);
        $task->update($data);
        return $task;
    }

    public function delete($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return true;
    }

    public function getTasksByProject($projectId)
    {
        return Task::where('project_id', $projectId)->get();
    }

    public function getTasksByProjectOwner($ownerId)
    {
        return Task::whereHas('project', function ($query) use ($ownerId) {
            $query->where('owner_id', $ownerId);
        })->get();
    }

    public function getTasksAssignedToUser($userId)
    {
        return Task::where('assigned_to', $userId)->get();
    }

    public function getProjectUsers($projectId)
    {
        $project = Project::findOrFail($projectId);
        return $project->users()->get();
    }

    public function isUserProjectMember($projectId, $userId)
    {
        return Project::where('id', $projectId)
            ->whereHas('participants', function ($query) use ($userId) {
                $query->where('user_accounts.id', $userId);
            })->exists();
    }

    public function addCommentToTask($taskId, array $data)
    {
        $comment = new Comment();
        $comment->comment = $data['comment'];
        $comment->task_id = $taskId;
        $comment->user_id = $data['user_id'];
        $comment->save();
        return $comment;
    }

    public function updateTaskStatus($taskId, $status)
    {
        $task = Task::findOrFail($taskId);
        $task->status = $status;
        $task->save();
        return $task;
    }

    public function getTaskComments($taskId)
    {
        return Comment::where('task_id', $taskId)->get();
    }
}