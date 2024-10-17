<?php
namespace App\Services;

use App\Repositories\Interfaces\UserAccountRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserAccountService
{
    protected $userAccountRepository;

    public function __construct(UserAccountRepositoryInterface $userAccountRepository)
    {
        $this->userAccountRepository = $userAccountRepository;
    }

    public function getAllUsers()
    {
        $currentUser = Auth::user();
        if ($currentUser->role === 'admin') {
            return $this->userAccountRepository->getAll(); // 全ユーザー取得
        } elseif ($currentUser->role === 'client') {
            return $this->userAccountRepository->getNonDeletedUsers('user'); // 一般ユーザーのみ取得
        } else {
            return null; // 権限なし
        }
    }

    public function createUser(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        return $this->userAccountRepository->create($data);
    }

    public function updateUser($id, array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $this->userAccountRepository->update($id, $data);
    }

    public function deleteUser($id)
    {
        if ($id == 1) {
            return false; // ID 1の管理者を削除できない
        }
        return $this->userAccountRepository->delete($id);
    }

    public function getAvailableUsersForProject($projectId)
    {
        return $this->userAccountRepository->getAvailableUsersForProject($projectId);
    }

    public function getUserTasks($userId)
    {
        return $this->userAccountRepository->getUserTasks($userId);
    }
}
