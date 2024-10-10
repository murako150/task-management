<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    // 管理者ダッシュボードの表示
    public function index()
    {
        return response()->json(['message' => 'Welcome to the Admin Dashboard']);
    }
}