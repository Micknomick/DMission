# ベースイメージの指定
FROM ruby:3.2.2

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  nodejs \
  postgresql-client \
  yarn

# 作業ディレクトリを指定
WORKDIR /app

# GemfileとGemfile.lockをコピーして、bundlerを実行
COPY Gemfile Gemfile.lock /app/

# bundlerのインストール
RUN gem install bundler

# 依存関係のインストール
RUN bundle install

# JavaScript依存関係をコピーしてインストール（キャッシュ効率化のため）
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn install --frozen-lockfile --network-timeout 600000

# アプリケーションのソースコードをコピー
COPY . /app

# JavaScriptの依存関係をインストール（package.jsonに基づく）
RUN yarn install

# entrypoint.shをコンテナにコピーし、実行権限を与える
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# ポートを指定
EXPOSE 3000

# コンテナ起動時にentrypoint.shを実行
ENTRYPOINT ["entrypoint.sh"]

# サーバー起動コマンド
CMD ["rails", "server", "-b", "0.0.0.0"]
