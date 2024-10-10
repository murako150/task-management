<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserAccount extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'user_id',
        'name',
        'furigana',
        'email',
        'password',
        'role', // ロールをfillableに追加
        'active_flag',    // roleの次に有効フラグ
        'deleted_flag',   // その次に削除フラグ
    ];

    protected $hidden = [
        'password',
    ];

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_user');
    }
    // ユーザーがオーナーとして所有しているプロジェクトを取得
    public function ownedProjects()
    {
        return $this->hasMany(Project::class, 'owner_id');
    }
    
    public function participatingProjects()
    {
        return $this->belongsToMany(Project::class, 'project_user', 'user_id', 'project_id');
    }

    // ユーザーは複数のタスクを持つ
    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    // ユーザーは複数のコメントを持つ
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // ロールの確認メソッドを追加
    public function hasRole($role)
    {
        return $this->role === $role;
    }
}