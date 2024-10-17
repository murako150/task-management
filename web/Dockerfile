# Node.jsをベースにしたDockerイメージを使用
FROM node:latest

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package.json ./
COPY package-lock.json ./

# 依存関係をインストール
ENV NODE_ENV=production
RUN npm install

# その他のプロジェクトファイルをコピー
COPY . .

# Reactアプリをビルド
RUN npm run build

# ポート3000を公開
# EXPOSE 33000 

# アプリを起動
CMD ["npm", "start"]