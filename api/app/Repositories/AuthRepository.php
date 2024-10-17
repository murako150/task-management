<?php

namespace App\Repositories;

use App\Repositories\Interfaces\AuthRepositoryInterface;
use App\Models\UserAccount;
use Illuminate\Support\Facades\Hash;

class AuthRepository implements AuthRepositoryInterface
{
    public function findUserByUserId($userId)
    {
        return UserAccount::where('user_id', $userId)->first();
    }

    public function validatePassword($user, $password)
    {
        return Hash::check($password, $user->password);
    }

    public function createToken($user)
    {
        return $user->createToken('auth_token')->plainTextToken;
    }

    public function revokeToken($user)
    {
        $user->currentAccessToken()->delete();
    }
}