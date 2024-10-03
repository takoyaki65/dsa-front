2024/03/22 updated
# installation（for Mac）

1. nodebrewのインストール
   ```sh
   brew install nodebrew  
   # nodebrewインストール用ディレクトリ作成
   mkdir ~/.nodebrew
   mkdir ~/.nodebrew/src
   ```
2. nodeインストール
   ```sh
   # 安定版インストール
   nodebrew install-binary stable

   # インストールしたバージョンの確認
   nodebrew ls

   # 使用するバージョン選択
   nodebrew use {バージョンを記入}

   # パスを通す
   # zshrcの部分は設定が書いてあるファイル
   echo 'export PATH="$HOME/.nodebrew/current/bin:$PATH"' >> ~/.zshrc

   # ターミナルを再起動するか以下で設定リロード
   source ~/.zshrc

   # バージョン確認
   node -v
   npm -v
   ```

3. リポジトリをクローン(dsa_projectのクローンでまとめて行われるはずなので基本的には不要)
   ```sh
   # 作業したいディレクトリへ移動
   cd {ディレクトリのパス}

   # リポジトリをクローン
   git clone https://github.com/zakkii-k/dsa_front.git
   ```

4. アプリケーションの起動(dsa_projectのdocker起動時に起動されるので基本的には不要)
   ```sh
   # ディレクトリ移動
   cd dsa_front

   # スタート
   npm start
   ```

## ホスト環境でIntellisenseなどを有効にする方法(環境をいじらずに)
1. venv環境の作成
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```
2. nodeenvのインストール
   ```sh
   pip install nodeenv
   ```
3. nodeenvの実行
   ```sh
   nodeenv -p
   ```
