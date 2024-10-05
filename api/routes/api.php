<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// 認証関連
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->put('/user/{id}', [UserAccountController::class, 'update']);

// ユーザー関連のルート
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user_accounts', [UserAccountController::class, 'addUser']);
    Route::get('/user_accounts', [UserAccountController::class, 'index']);
    Route::get('/user_accounts/{id}', [UserAccountController::class, 'show']);
    Route::get('/user/tasks', [UserAccountController::class, 'getUserTasks']);
});

// タスク関連のルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']); // タスク一覧
    Route::get('/tasks/{id}', [TaskController::class, 'show']); // タスク詳細
    Route::post('/tasks', [TaskController::class, 'store']); // タスク作成
    Route::put('/tasks/{id}', [TaskController::class, 'update']); // タスク更新
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']); // タスク削除
    Route::put('/user/tasks/{id}/status', [TaskController::class, 'updateStatus']); // ステータス更新
    Route::post('user/tasks/{task_id}/comments', [TaskController::class, 'addComment']); // コメント追加用
    Route::get('user/tasks/{task_id}/comments', [TaskController::class, 'getComments']); // コメント取得用
    Route::post('/projects/{projectId}/tasks', [TaskController::class, 'store']); // タスク作成
});

// プロジェクト関連のルート
Route::middleware('auth:sanctum')->apiResource('projects', ProjectController::class);
Route::post('/projects/{projectId}/add-user', [ProjectController::class, 'addUserToProject']);
Route::get('projects/{project_id}/tasks', [TaskController::class, 'getTasksByProject']); // プロジェクトに関連するタスクを取得

// タスクコメント関連のルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('tasks/{task_id}/comments', [CommentController::class, 'index']); // コメント一覧
    Route::post('tasks/{task_id}/comments', [CommentController::class, 'store']); // コメント作成
    Route::put('comments/{id}', [CommentController::class, 'update']); // コメント更新
    Route::delete('comments/{id}', [CommentController::class, 'destroy']); // コメント削除
});

// クライアント関連のルート
Route::middleware('auth:sanctum')->get('/clients', [UserAccountController::class, 'getClients']);

// プロジェクトに参加しているユーザー取得
Route::middleware('auth:sanctum')->get('/projects/{projectId}/users', [ProjectController::class, 'getProjectUsers']);

// プロジェクトにユーザーを追加
Route::middleware('auth:sanctum')->post('/projects/{projectId}/add-user', [ProjectController::class, 'addUserToProject']);
Route::middleware('auth:sanctum')->get('/projects/{projectId}/available-users', [UserAccountController::class, 'getAvailableUsersForProject']);