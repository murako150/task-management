<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_accounts', function (Blueprint $table) {
            $table->id();  // 自動増加ID
            $table->string('user_id')->unique();  // ユーザーID（ユニーク）
            $table->string('name');  // 名前
            $table->string('furigana')->nullable();  // ふりがな（オプション）
            $table->string('email')->unique();  // メールアドレス（ユニーク）
            $table->string('password');  // パスワード（ハッシュ化）
            $table->enum('role', ['admin', 'client', 'user'])->default('user');  // 役割
            $table->timestamps();  // 作成日と更新日
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_accounts');
    }
}