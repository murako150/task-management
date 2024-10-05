# PHP 8.3とApacheをベースにしたDockerイメージ
FROM php:8.3-apache

# 必要なPHP拡張をインストール
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    libzip-dev && \
    docker-php-ext-install pdo pdo_mysql zip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Apacheの設定ファイルにServerNameを追加
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリを設定
WORKDIR /var/www

# Laravelプロジェクトをコピー
COPY . .

# Composerの依存関係をインストール
RUN composer install --no-interaction --optimize-autoloader

# ApacheのドキュメントルートをLaravelのpublicディレクトリに設定
RUN sed -i 's|/var/www/html|/var/www/public|g' /etc/apache2/sites-available/000-default.conf

# migrate-and-seed.sh をコピーして、実行権限を付与
COPY ./migrate-and-seed.sh /migrate-and-seed.sh
RUN chmod +x /migrate-and-seed.sh

# ポート80を公開
EXPOSE 80

RUN a2enmod rewrite

# Apacheサーバーを起動
CMD ["/bin/bash", "-c", "apache2-foreground & sleep 10 && /migrate-and-seed.sh && wait"]