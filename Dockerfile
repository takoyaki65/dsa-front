# ベースイメージ
FROM node:20

# アプリケーションディレクトリを作成
WORKDIR /app

# アプリケーションの依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションのソースをバンドル
COPY . .

# アプリを起動
CMD ["npm", "start"]
