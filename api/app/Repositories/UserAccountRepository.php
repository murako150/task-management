<?php
namespace App\Repositories;

use App\Repositories\Interfaces\UserAccountRepositoryInterface;
use App\Models\UserAccount;
use App\Models\Project;
use App\Models\Task;

class UserAccountRepository implements UserAccountRepositoryInterface
{
    public function getAll()
    {
        return UserAccount::all();
    }

    public function getNonDeletedUsers($role)
    {
        return UserAccount::where('role', $role)
                          ->where('deleted_flag', 0)
                          ->get();
    }

    public function create(array $data)
    {
        return UserAccount::create($data);
    }

    public function update($id, array $data)
    {
        $user = UserAccount::findOrFail($id);
        $user->update($data);
        return $user;
    }

    public function delete($id)
    {
        $user = UserAccount::findOrFail($id);
        $user->update(['deleted_flag' => 1]);
    }

    public function getAvailableUsersForProject($projectId)
    {
        $project = Project::findOrFail($projectId);
        $projectUsers = $project->users()->pluck('user_accounts.id')->toArray();
        return UserAccount::whereNotIn('id', $projectUsers)
                          ->where('active_flag', 1)
                          ->where('deleted_flag', 0)
                          ->whereNotIn('role', ['admin', 'client'])
                          ->get();
    }

    public function getUserTasks($userId)
    {
        return Task::where('user_id', $userId)->get();
    }
}
