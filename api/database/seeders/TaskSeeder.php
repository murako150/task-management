<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;

class TaskSeeder extends Seeder
{
    public function run()
    {
        // プロジェクト1のタスク
        Task::create([
            'title' => 'タスク1',
            'description' => 'プロジェクトAのタスク1',
            'status' => 'in_progress',
            'assigned_to' => 4,  // 一般ユーザーA
            'project_id' => 1,  // プロジェクトA
            'due_date' => now()->addDays(10),
        ]);

        // プロジェクト2のタスク
        Task::create([
            'title' => 'タスク2',
            'description' => 'プロジェクトBのタスク2',
            'status' => 'pending',
            'assigned_to' => 5,  // 一般ユーザーB
            'project_id' => 2,  // プロジェクトB
            'due_date' => now()->addDays(5),
        ]);

        Task::create([
            'title' => 'タスク3',
            'description' => 'プロジェクトCのタスク3',
            'status' => 'completed',
            'assigned_to' => 4,  // 一般ユーザーA
            'project_id' => 3,  // プロジェクトC
            'due_date' => now()->addDays(15),
        ]);
    }
}