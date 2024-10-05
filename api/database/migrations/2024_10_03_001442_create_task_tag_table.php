<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaskTagTable extends Migration
{
    public function up()
    {
        Schema::create('task_tag', function (Blueprint $table) {
            $table->id();  // ID
            $table->unsignedBigInteger('task_id');  // タスクID
            $table->unsignedBigInteger('tag_id');  // タグID
            $table->timestamps();

            // 外部キー制約
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('task_tag');
    }
}