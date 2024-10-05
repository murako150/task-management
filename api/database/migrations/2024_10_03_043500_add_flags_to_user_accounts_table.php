<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFlagsToUserAccountsTable extends Migration
{
    public function up()
    {
        Schema::table('user_accounts', function (Blueprint $table) {
            // すでに存在しない場合のみカラムを追加
            if (!Schema::hasColumn('user_accounts', 'active_flag')) {
                $table->boolean('active_flag')->default(true)->after('role');   // roleの次に有効フラグ
            }

            if (!Schema::hasColumn('user_accounts', 'deleted_flag')) {
                $table->boolean('deleted_flag')->default(false)->after('active_flag'); // active_flagの次に削除フラグ
            }
        });
    }

    public function down()
    {
        Schema::table('user_accounts', function (Blueprint $table) {
            // カラムが存在する場合のみ削除
            if (Schema::hasColumn('user_accounts', 'active_flag')) {
                $table->dropColumn('active_flag');
            }

            if (Schema::hasColumn('user_accounts', 'deleted_flag')) {
                $table->dropColumn('deleted_flag');
            }
        });
    }
}