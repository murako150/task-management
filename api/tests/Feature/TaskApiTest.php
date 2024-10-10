<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\UserAccount;
use App\Models\Task;
use App\Models\Project;
use Laravel\Sanctum\Sanctum;

class TaskApiTest extends TestCase
{
    public function test_create_task_with_existing_project_for_client()
    {
        // クライアント1のユーザーIDを使用
        $clientUser = UserAccount::find(2); // ID: 2はクライアントA

        // クライアント1のプロジェクトを使用
        $project = Project::find(1); // プロジェクトA

        // Sanctumを使ってクライアントとして認証
        Sanctum::actingAs($clientUser);

        // クライアントが新しいタスクをプロジェクトAに作成
        $response = $this->postJson('/api/tasks', [
            'title' => 'クライアントAのタスク',
            'description' => 'これはクライアントAが作成したタスクです。',
            'assigned_to' => $clientUser->id,  // クライアント自身にタスクを割り当て
            'project_id' => $project->id,      // プロジェクトAに関連付け
            'due_date' => '2024-10-15',
        ]);

        // ステータスが201（作成成功）であることを確認
        $response->assertStatus(201);
        $response->assertJson([
            'title' => 'クライアントAのタスク',
            'project_id' => $project->id, // プロジェクトIDが正しく設定されているか確認
        ]);

        // データベースにタスクが正しく保存されているか確認
        $this->assertDatabaseHas('tasks', [
            'title' => 'クライアントAのタスク',
            'project_id' => $project->id,
            'assigned_to' => $clientUser->id,
        ]);
    }

    public function test_list_tasks_for_client_project()
    {
        // クライアント1のユーザーIDを使用
        $clientUser = UserAccount::find(2); // ID: 2はクライアントA

        // クライアント1のプロジェクトを使用
        $project = Project::find(1); // プロジェクトA

        // Sanctumを使ってクライアントとして認証
        Sanctum::actingAs($clientUser);

        // プロジェクトに関連するタスクの一覧を取得するAPIリクエスト
        $response = $this->getJson("/api/projects/{$project->id}/tasks");

        // ステータスが200（成功）であることを確認
        $response->assertStatus(200);

        // レスポンスにタスクが含まれているか確認
        $response->assertJsonFragment([
            'project_id' => $project->id,
        ]);
    }
}