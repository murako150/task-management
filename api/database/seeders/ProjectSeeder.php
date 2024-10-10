<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\UserAccount;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        // クライアント1のプロジェクト
        $project1 = Project::create([
            'name' => 'プロジェクトA',
            'owner_id' => 2,  // クライアント1
        ]);

        // クライアント2のプロジェクト
        $project2 = Project::create([
            'name' => 'プロジェクトB',
            'owner_id' => 2,  // クライアント2
        ]);

        // クライアント3のプロジェクト
        $project3 = Project::create([
            'name' => 'プロジェクトC',
            'owner_id' => 3,  // クライアント3
        ]);

        // 一般ユーザーを作成し、それぞれのプロジェクトに参加させる
        $user1 = UserAccount::create([
            'user_id' => 'user1',
            'name' => '一般ユーザーA',
            'email' => 'user1@example.com',
            'password' => bcrypt('test'),
            'role' => 'user',
        ]);
        $user1->participatingProjects()->attach([$project1->id, $project2->id]); // participatingProjects()リレーションを使う

        $user2 = UserAccount::create([
            'user_id' => 'user2',
            'name' => '一般ユーザーB',
            'email' => 'user2@example.com',
            'password' => bcrypt('test'),
            'role' => 'user',
        ]);
        $user2->participatingProjects()->attach([$project2->id, $project3->id]); // participatingProjects()リレーションを使う

        // 有効フラグが無効のユーザー（active = 0）
        $user3 = UserAccount::create([
            'user_id' => 'user3',
            'name' => '無効ユーザー',
            'email' => 'inactive@example.com',
            'password' => bcrypt('test'),
            'role' => 'user',
            'active_flag' => 0,  // 有効フラグが無効
        ]);

        // 削除フラグがついているユーザー（deleted_flag = 1）
        $user4 = UserAccount::create([
            'user_id' => 'user4',
            'name' => '削除ユーザー',
            'email' => 'deleted@example.com',
            'password' => bcrypt('test'),
            'role' => 'user',
            'deleted_flag' => 1,  // 削除フラグ
        ]);
    }
}