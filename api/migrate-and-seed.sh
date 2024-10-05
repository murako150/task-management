#!/bin/bash

FLAG_FILE="/var/www/migrated_and_seeded.flag"

if [ ! -f "$FLAG_FILE" ]; then
  echo "初回起動のため、マイグレーションとシードを実行します。"
  php artisan migrate:fresh --seed
  touch "$FLAG_FILE"
  echo "マイグレーションとシードが完了しました。"
else
  echo "マイグレーションとシードは既に実行されています。"
fi