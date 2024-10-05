<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSoftDeletesToUserAccountsTable extends Migration
{
    public function up()
    {
        Schema::table('user_accounts', function (Blueprint $table) {
            $table->softDeletes();  // deleted_atカラムを追加
        });
    }

    public function down()
    {
        Schema::table('user_accounts', function (Blueprint $table) {
            $table->dropSoftDeletes();  // rollback時にdeleted_atカラムを削除
        });
    }
}