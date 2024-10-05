<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\Task;
use App\Models\UserAccount;

class CommentSeeder extends Seeder
{
    public function run()
    {
        // テスト用のユーザーを作成、既存ユーザーがいない場合のみ作成
        $user1 = UserAccount::firstOrCreate([
            'user_id' => 'user1',
        ], [
            'name' => '一般ユーザーA',
            'email' => 'user1@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        $user2 = UserAccount::firstOrCreate([
            'user_id' => 'user2',
        ], [
            'name' => '一般ユーザーB',
            'email' => 'user2@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        // テスト用のタスクを作成
        $task1 = Task::firstOrCreate([
            'title' => 'タスク1',
            'project_id' => 1,
        ], [
            'description' => 'タスク1の説明',
            'status' => 'in_progress',
            'assigned_to' => $user1->id,
            'due_date' => now()->addDays(5),
        ]);

        $task2 = Task::firstOrCreate([
            'title' => 'タスク2',
            'project_id' => 1,
        ], [
            'description' => 'タスク2の説明',
            'status' => 'pending',
            'assigned_to' => $user2->id,
            'due_date' => now()->addDays(10),
        ]);

        // テスト用のコメントを作成
        Comment::create([
            'task_id' => $task1->id,
            'user_id' => $user1->id,
            'comment' => 'これはタスク1へのコメントです。',
        ]);

        Comment::create([
            'task_id' => $task1->id,
            'user_id' => $user2->id,
            'comment' => 'これはタスク1への2番目のコメントです。',
        ]);

        Comment::create([
            'task_id' => $task2->id,
            'user_id' => $user1->id,
            'comment' => 'これはタスク2へのコメントです。',
        ]);
    }
}