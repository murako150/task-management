<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();  // プロジェクトID
            $table->string('name');  // プロジェクト名
            $table->text('description')->nullable();  // プロジェクトの説明
            $table->unsignedBigInteger('owner_id');  // プロジェクト所有者のユーザーID
            $table->foreign('owner_id')->references('id')->on('user_accounts')->onDelete('cascade');  // 外部キー制約
            $table->timestamps();  // 作成日と更新日
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }
}