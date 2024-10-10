<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\UserAccount;
use App\Models\Project;
use Laravel\Sanctum\Sanctum;

class ProjectApiTest extends TestCase
{
    // クライアントが参加しているプロジェクトの一覧を取得するテスト
    public function test_list_projects_for_client()
    {
        $clientUser = UserAccount::find(2); // クライアントA
        
        Sanctum::actingAs($clientUser);

        // クライアントが自身のプロジェクトを取得できることを確認
        $response = $this->getJson('/api/projects');
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'プロジェクトA']);
        $response->assertJsonFragment(['name' => 'プロジェクトB']);
    }

    // クライアントがプロジェクトを作成するテスト
    public function test_create_project_for_client()
    {
        $clientUser = UserAccount::find(2); // クライアントA
        
        Sanctum::actingAs($clientUser);

        $response = $this->postJson('/api/projects', [
            'name' => '新しいプロジェクト',
            'description' => 'プロジェクトの説明',
        ]);

        // ステータスが201（作成成功）であることを確認
        $response->assertStatus(201);
        $response->assertJsonFragment(['name' => '新しいプロジェクト']);
    }

    // クライアントがプロジェクトを更新するテスト
    public function test_update_project_for_client()
    {
        $clientUser = UserAccount::find(2); // クライアントA
        $project = Project::find(1); // プロジェクトA
        
        Sanctum::actingAs($clientUser);

        $response = $this->putJson("/api/projects/{$project->id}", [
            'name' => '更新されたプロジェクトA',
            'description' => '更新された説明',
        ]);

        // ステータスが200（成功）であることを確認
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => '更新されたプロジェクトA']);

        // データベースに変更が反映されているか確認
        $this->assertDatabaseHas('projects', [
            'name' => '更新されたプロジェクトA',
            'description' => '更新された説明',
        ]);
    }

    // クライアントがプロジェクトを削除するテスト
    public function test_delete_project_for_client()
    {
        $clientUser = UserAccount::find(2); // クライアントA
        $project = Project::find(1); // プロジェクトA

        Sanctum::actingAs($clientUser);

        // プロジェクトを削除するAPIリクエスト
        $response = $this->deleteJson("/api/projects/{$project->id}");

        // ステータスが200（成功）であることを確認
        $response->assertStatus(200);

        // データベースからプロジェクトが削除されたことを確認
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }
}