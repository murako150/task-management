<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Task;
use App\Models\UserAccount;
use App\Models\Comment;
use Laravel\Sanctum\Sanctum;

class CommentApiTest extends TestCase
{
    // コメントの作成テスト
    public function test_create_comment()
    {
        // 既存のユーザーとタスクを使用
        $user = UserAccount::find(2); // ユーザーID 2（クライアントA）
        $task = Task::find(1); // タスクID 1
        
        // ユーザーとして認証
        Sanctum::actingAs($user);

        // コメントの作成リクエストを送信
        $response = $this->postJson("/api/tasks/{$task->id}/comments", [
            'comment' => 'このタスクの新しいコメントです。',
        ]);

        // ステータスが201（作成成功）であることを確認
        $response->assertStatus(201);
        $response->assertJsonFragment([
            'comment' => 'このタスクの新しいコメントです。',
            'user_id' => $user->id,
        ]);

        // データベースにコメントが保存されていることを確認
        $this->assertDatabaseHas('comments', [
            'comment' => 'このタスクの新しいコメントです。',
            'task_id' => $task->id,
            'user_id' => $user->id,
        ]);
    }

    // コメントの一覧取得テスト
    public function test_get_comments_for_task()
    {
        // 既存のユーザーとタスクを使用
        $user = UserAccount::find(2); // ユーザーID 2（クライアントA）
        $task = Task::find(1); // タスクID 1

        // ユーザーとして認証
        Sanctum::actingAs($user);

        // コメントの一覧取得リクエストを送信
        $response = $this->getJson("/api/tasks/{$task->id}/comments");

        // ステータスが200（成功）であることを確認
        $response->assertStatus(200);

        // コメントデータが含まれていることを確認
        $response->assertJsonFragment([
            'task_id' => $task->id,
        ]);
    }

    // コメントの削除テスト
    public function test_delete_comment()
    {
        // 既存のユーザーとタスクを使用
        $user = UserAccount::find(2); // ユーザーID 2（クライアントA）
        $task = Task::find(1); // タスクID 1

        // まずコメントを作成
        $comment = Comment::create([
            'comment' => '削除されるコメントです。',
            'task_id' => $task->id,
            'user_id' => $user->id,
        ]);

        // ユーザーとして認証
        Sanctum::actingAs($user);

        // コメント削除リクエストを送信
        $response = $this->deleteJson("/api/comments/{$comment->id}");

        // ステータスが200（成功）であることを確認
        $response->assertStatus(200);

        // コメントがデータベースから削除されていることを確認
        $this->assertDatabaseMissing('comments', [
            'id' => $comment->id,
        ]);
    }
}