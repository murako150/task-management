<?php

namespace Database\Factories;

use App\Models\UserAccount;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserAccountFactory extends Factory
{
    // 対応するモデルを指定
    protected $model = UserAccount::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => $this->faker->unique()->userName,
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'), // パスワードは bcrypt でハッシュ化
            'role' => $this->faker->randomElement(['admin', 'client', 'user']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}