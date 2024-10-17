<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only(['user_id', 'password']);

        $result = $this->authService->login($credentials);

        if ($result === null) {
            return response()->json(['message' => 'ユーザーIDまたはパスワードが正しくありません'], 401);
        }

        if ($result === 'unauthorized') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($result);
    }

    public function logout(Request $request)
    {
        $this->authService->logout();
        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}