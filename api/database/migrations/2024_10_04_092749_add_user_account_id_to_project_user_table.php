<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserAccountIdToProjectUserTable extends Migration
{
    public function up()
    {
        Schema::table('project_user', function (Blueprint $table) {
            // user_account_idをnullableにして、デフォルト値を持たないように設定
            $table->unsignedBigInteger('user_account_id')->nullable()->after('user_id');
        });
    }
    
    public function down()
    {
        Schema::table('project_user', function (Blueprint $table) {
            $table->dropColumn('user_account_id');
        });
    }
}