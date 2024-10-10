<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserAccount;

class ClientSeeder extends Seeder
{
    public function run()
    {
        // クライアントを3人作成
        UserAccount::create([
            'user_id' => 'client1',
            'name' => 'クライアントA',
            'email' => 'client1@example.com',
            'password' => bcrypt('test'),  // パスワードは bcrypt でハッシュ化
            'role' => 'client',
        ]);

        UserAccount::create([
            'user_id' => 'client2',
            'name' => 'クライアントB',
            'email' => 'client2@example.com',
            'password' => bcrypt('test'),
            'role' => 'client',
        ]);

        UserAccount::create([
            'user_id' => 'client3',
            'name' => 'クライアントC',
            'email' => 'client3@example.com',
            'password' => bcrypt('test'),
            'role' => 'client',
        ]);
    }
}