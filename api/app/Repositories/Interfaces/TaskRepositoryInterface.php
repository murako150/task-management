<?php

namespace App\Repositories\Interfaces;

interface TaskRepositoryInterface
{
    public function getAll();
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getTasksByProject($projectId);
    public function getTasksByProjectOwner($ownerId);  // プロジェクトオーナーのタスク取得
    public function getTasksAssignedToUser($userId);   // 担当ユーザーのタスク取得
    public function getProjectUsers($projectId);
    public function isUserProjectMember($projectId, $userId);  // ユーザーがプロジェクトのメンバーか確認
    public function addCommentToTask($taskId, array $data);
    public function updateTaskStatus($taskId, $status);
    public function getTaskComments($taskId);
}