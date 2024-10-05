<?php

namespace App\Http\Controllers;

use App\Models\UserAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ログイン機能
    public function login(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string',
            'password' => 'required|string',
        ]);

        // ユーザーを取得
        $user = UserAccount::where('user_id', $request->user_id)->first();

        // ユーザーが存在しない、またはパスワードが間違っている場合
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'ユーザーIDまたはパスワードが正しくありません'], 401);
        }

        // ユーザーが存在しない、または有効でない場合は403エラーを返す
        if (!$user || !$user->active_flag || $user->deleted_flag) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // ログイン成功後、トークンを作成
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'id' => $user->id, // ここにユーザーIDを追加
            'user_id' => $user->user_id, // ここにユーザーIDを追加
            'name' => $user->name, // ここにユーザーIDを追加
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role,
        ]);
    }

    // ログアウト処理
    public function logout(Request $request)
    {
        // ユーザーの現在のアクセストークンを無効化する
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}