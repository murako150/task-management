<?php
namespace App\Repositories\Interfaces;

interface UserAccountRepositoryInterface
{
    public function getAll();
    public function getNonDeletedUsers($role);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getAvailableUsersForProject($projectId);
    public function getUserTasks($userId);
}
