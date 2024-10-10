<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();  // コメントID
            $table->unsignedBigInteger('task_id');  // タスクID
            $table->unsignedBigInteger('user_id');  // コメントしたユーザーID
            $table->text('comment');  // コメント内容
            $table->timestamps();  // 作成日と更新日

            // 外部キー制約
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('user_accounts')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
}