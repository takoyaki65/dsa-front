2024/03/22 updated
# installation（for Mac）
1. homebrewのインストール  
   [homebrewのページ](https://brew.sh/ja/)を開いてインストールコマンドをターミナルにコピペ&実行．  
   パス等の設定ができていない場合はそれも行う．
2. nodebrewのインストール
   ```
   brew install nodebrew  
   # nodebrewインストール用ディレクトリ作成
   mkdir ~/.nodebrew
   mkdir ~/.nodebrew/src
   ```
3. nodeインストールインストール
   ```
   # 安定版インストール
   nodebrew install-binary stable
   ```
4. nodeのバージョンを選択
   ```
   # インストールしたバージョンの確認
   nodebrew ls

   # 使用するバージョン選択
   nodebrew use {バージョンを記入}

   # パスを通す
   export PATH=$HOME/.nodebrew/current/bin:$PATH

   # ターミナルを再起動するか以下で設定リロード
   # zshrcの部分は設定が書いてあるファイル
   source ~/.zshrc

   # バージョン確認
   node -v
   npm -v
   ```
5. アプリケーションの起動
   ```
   # ディレクトリ移動
   cd dsa_front

   # スタート
   npm start
   ```
