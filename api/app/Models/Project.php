<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
    ];

    // プロジェクトはユーザーに所属
    public function owner()
    {
        return $this->belongsTo(UserAccount::class, 'owner_id');
    }

    // プロジェクトに参加しているユーザーを取得（多対多のリレーション）
    public function users()
    {
        return $this->belongsToMany(UserAccount::class, 'project_user', 'project_id', 'user_id');
    }

    public function participants()
    {
        return $this->belongsToMany(UserAccount::class, 'project_user', 'project_id', 'user_id');
    }

    // プロジェクトは複数のタスクを持つ
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}