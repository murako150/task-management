<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'user_id',
        'comment',
    ];

    // コメントは1つのタスクに属する
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    // コメントはユーザーによって作成される
    public function user()
    {
        return $this->belongsTo(UserAccount::class);
    }
}