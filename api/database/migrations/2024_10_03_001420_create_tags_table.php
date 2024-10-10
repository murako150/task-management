<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTagsTable extends Migration
{
    public function up()
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();  // タグID
            $table->string('name');  // タグ名
            $table->timestamps();  // 作成日と更新日
        });
    }

    public function down()
    {
        Schema::dropIfExists('tags');
    }
}