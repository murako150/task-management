<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddParentIdToTasksTable extends Migration
{
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->bigInteger('parent_id')->nullable()->unsigned()->after('id');

            // 親タスクの外部キー制約を追加
            $table->foreign('parent_id')->references('id')->on('tasks')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            // 外部キー制約を削除
            $table->dropForeign(['parent_id']);
            $table->dropColumn('parent_id');
        });
    }
}