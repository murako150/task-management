<?php

namespace App\Services;

use App\Repositories\Interfaces\AuthRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    protected $authRepository;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function login($credentials)
    {
        $user = $this->authRepository->findUserByUserId($credentials['user_id']);
        if (!$user || !$this->authRepository->validatePassword($user, $credentials['password'])) {
            return null; // 認証失敗
        }

        if (!$user->active_flag || $user->deleted_flag) {
            return 'unauthorized'; // アカウントが無効
        }

        $token = $this->authRepository->createToken($user);

        return [
            'id' => $user->id,
            'user_id' => $user->user_id,
            'name' => $user->name,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role,
        ];
    }

    public function logout()
    {
        $this->authRepository->revokeToken(Auth::user());
        return true;
    }
}