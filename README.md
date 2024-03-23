2024/03/22 updated
# installation（for Mac）
1. homebrewのインストール  
   [homebrewのページ](https://brew.sh/ja/)を開いてインストールコマンドをターミナルにコピペ&実行．  
   パス等の設定ができていない場合はそれも行う．

2. nodebrewのインストール
   ```sh
   brew install nodebrew  
   # nodebrewインストール用ディレクトリ作成
   mkdir ~/.nodebrew
   mkdir ~/.nodebrew/src
   ```
3. nodeインストール
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
4. gitのインストール
   ```sh
   # インストール
   brew install git

   # パスを通す
   # zshrcの部分は設定が書いてあるファイル
   echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc

   # ターミナルを再起動するか以下で設定リロード
   source ~/.zshrc
   ```
5. リポジトリをクローン
   ```sh
   # 作業したいディレクトリへ移動
   cd {ディレクトリのパス}

   # リポジトリをクローン
   git clone https://github.com/zakkii-k/dsa_front.git
   ```

6. アプリケーションの起動
   ```sh
   # ディレクトリ移動
   cd dsa_front

   # スタート
   npm start
   ```
