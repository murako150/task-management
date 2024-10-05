<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'owner_id' => \App\Models\UserAccount::factory(), // ユーザーのファクトリを使ってオーナーを生成
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}