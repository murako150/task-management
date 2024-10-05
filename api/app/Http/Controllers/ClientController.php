<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClientController extends Controller
{
    // クライアントダッシュボードの表示
    public function index()
    {
        return response()->json(['message' => 'Welcome to the Client Dashboard']);
    }
}