#!/bin/bash
set -e

# 既存のサーバーPIDファイルがある場合は削除
rm -f /app/tmp/pids/server.pid

# データベースがなければ作成（エラーは無視）
bundle exec rails db:create || true

# データベースのマイグレーションを実行
bundle exec rails db:migrate

# Dockerfileで指定されたコマンドを実行
exec "$@"
