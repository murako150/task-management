
# タスク管理システム

## 概要

本プロジェクトは、タスク管理システムです。複数のプロジェクトに対するタスクの進捗を管理し、ユーザーの役割ごとに異なる権限を提供します。

## ディレクトリ構成
```
├── web/                # Reactベースのフロントエンドアプリケーション
├── api/                # LaravelベースのバックエンドAPI
├── phpmyadmin/         # phpMyAdmin用の設定
├── docker-compose.yml  # Dockerコンテナの設定ファイル
```

## 環境構築手順

1. **Dockerを使った開発環境構築**

   このプロジェクトは、Dockerを使用して構築されています。
   以下の手順に従って、環境をセットアップしてください。

   1. リポジトリをクローンします:
      ```bash
      git clone https://github.com/murako150/task-management.git
      cd task-management
      ```

   2. Dockerコンテナをビルドし、起動します:
      ```bash
      docker-compose up --build
      ```

2. **マイグレーションの実行**

   初回のコンテナ起動時には、Laravelのマイグレーションとシーディングが自動で実行されます。もし手動で実行する必要がある場合は、以下のコマンドを使用してください:

   ```bash
   docker-compose exec api bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

   **注**: `api/フォルダにmigrated_and_seeded.flag ファイルがある場合、削除して再度マイグレーションを実行してください。

## 使用技術

- フロントエンド: React
- バックエンド: Laravel
- データベース: MySQL
- コンテナ管理: Docker

## 起動時のURL

- **フロントエンドアプリケーション（React）**: http://localhost:30000
- **バックエンドAPI（Laravel）**: http://localhost:30001
- **phpMyAdmin**: http://localhost:33002

## ログイン情報

### 管理者アカウント
- **ユーザーID**: `admin`
- **パスワード**: `test`

### クライアントアカウント
- **ユーザーID**: `client1`
- **パスワード**: `test`

### 一般ユーザーアカウント
- **ユーザーID**: `user1`
- **パスワード**: `test`

## phpMyAdminログイン情報

- **ユーザーID**: `user`
- **パスワード**: `userpass`

## データベース名

- **データベース名**: `project_tracker`

## トラブルシューティング

### データベースへの接続エラー

環境変数ファイル `.env` の設定を確認してください。特に `DB_HOST` や `DB_PORT` の設定が正しいことを確認します。

### マイグレーションのエラー

マイグレーションやシーディングでエラーが発生した場合、以下の手順を試してください:

1. `api/migrated_and_seeded.flag` ファイルが存在しないことを確認する。
2. 以下のコマンドでマイグレーションを再実行する:
   ```bash
   docker-compose exec api bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

## 今後の機能拡張

- レスポンシブデザイン: モバイルデバイス対応
- ユーザー管理の改善: 削除機能や複雑なアクセス制御の追加
- プロジェクト・タスクの検索機能: タスクの効率的な検索をサポート

# task-management
