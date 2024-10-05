<?php

namespace Database\Seeders;
// database/seeders/DatabaseSeeder.php

use Illuminate\Database\Seeder;
use App\Models\UserAccount;  // これを追加
use Illuminate\Support\Facades\Hash;  // Hash クラスをインポート

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // 初期ユーザーを作成
        UserAccount::create([
            'user_id' => 'admin',
            'name' => '管理者',
            'furigana' => 'かんりしゃ',
            'email' => 'admin@example.com',
            'password' => Hash::make('test'),  // パスワードはハッシュ化
            'role' => 'admin',
        ]);
        $this->call([
            ClientSeeder::class,
            ProjectSeeder::class,
            TaskSeeder::class,
            CommentSeeder::class,
        ]);
    }
}