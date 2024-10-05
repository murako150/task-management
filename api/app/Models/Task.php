<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // タスクモデルで使用するテーブル名（省略可能、デフォルトで「tasks」テーブルを使用）
    protected $table = 'tasks';

    // 複数代入可能な属性を指定
    protected $fillable = [
        'title', 
        'description', 
        'status', 
        'assigned_to', 
        'due_date',
        'project_id' // プロジェクトIDを追加
    ];

    /**
     * タスクが割り当てられているユーザーを取得
     */
    public function assignedUser()
    {
        return $this->belongsTo(UserAccount::class, 'assigned_to'); // UserAccountモデルとの関連
    }

    /**
     * タスクに関連するプロジェクトを取得
     */
    public function project()
    {
        return $this->belongsTo(Project::class); // Projectモデルとの関連
    }

    /**
     * タスクに関連するコメントを取得
     */
    public function comments()
    {
        return $this->hasMany(Comment::class); // Commentモデルとの関連
    }

    /**
     * タスクに関連するタグを取得
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'task_tag'); // タスクとタグの多対多のリレーション
    }
}