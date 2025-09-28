# Pierrot ファッションショップ

Pierrot ファッションショップの公式ウェブサイトです。Google SheetsとGoogle Driveを活用した商品管理システムを採用しています。

## 🚀 機能

- **レスポンシブデザイン**: デスクトップ、タブレット、スマートフォンに対応
- **動的商品管理**: Google Sheetsから商品データを自動取得
- **画像管理**: Google Driveから商品画像を動的表示
- **検索・フィルタリング**: 商品名、カテゴリ、価格での検索・絞り込み
- **商品詳細モーダル**: クリックで詳細情報を表示
- **ページネーション**: 大量の商品を効率的に表示
- **ビュー切り替え**: グリッド表示・リスト表示の切り替え
- **エラーハンドリング**: 堅牢なエラー処理とフォールバック機能

## 🛠 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **データ管理**: Google Sheets API (CSV)
- **画像管理**: Google Drive API
- **デプロイ**: GitHub Pages
- **パフォーマンス**: キャッシュ、遅延読み込み、デバウンス

## 📁 プロジェクト構造

```
pierrot-hp/
├── index.html              # メインページ
├── css/
│   └── styles.css          # スタイルシート
├── js/
│   ├── config.js           # 設定管理
│   ├── utils.js            # ユーティリティ関数
│   ├── error-handler.js    # エラーハンドリング
│   ├── debug.js            # デバッグ機能
│   ├── product-manager.js  # 商品データ管理
│   ├── product-display.js  # 商品表示管理
│   └── script.js           # メインスクリプト
└── README.md
```

## ⚙️ 設定

### 環境変数

以下の環境変数で設定をカスタマイズできます：

```bash
GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/...
GOOGLE_DRIVE_BASE_URL=https://drive.google.com/uc?export=view&id=
APP_NAME=Pierrot
DEBUG=false
```

### デバッグモード

URLパラメータでデバッグモードを有効化：

```
https://your-site.com?debug=true
```

## 🔧 開発

### ローカル開発

1. リポジトリをクローン
```bash
git clone https://github.com/yamamoto-ayano/pierrot-hp.git
cd pierrot-hp
```

2. ローカルサーバーを起動
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# VS Code Live Server
# Live Server拡張機能を使用
```

3. ブラウザでアクセス
```
http://localhost:8000
```

### デバッグ機能

ブラウザのコンソールで以下のコマンドが使用できます：

```javascript
// 画像URLテスト
debug.testImage('1MGo1a7MCO6bR_ZtgKLVQRraEigizPxro');

// デバッグ情報表示
debug.showInfo();

// ログ取得
debug.getLogs();

// ログエクスポート
debug.exportLogs();
```

## 📊 データ管理

### Google Sheets設定

商品データは以下の形式でGoogle Sheetsに保存：

| 列名 | 説明 | 例 |
|------|------|-----|
| category | カテゴリコード | A, B, C... |
| sku | 商品コード | a1, a2, a3... |
| name | 商品名 | 綿混ボリュームスリーブニット |
| price | 価格 | 3790 |
| image_file_ids | Google DriveファイルID | 1MGo1a7MCO6bR_ZtgKLVQRraEigizPxro |
| last_updated | 最終更新日時 | 2025-09-28T05:25:00.000Z |

### Google Drive設定

1. 商品画像をGoogle Driveにアップロード
2. 画像の共有設定を「リンクを知っている全員が閲覧可能」に設定
3. ファイルIDをGoogle Sheetsの`image_file_ids`列に記入

## 🚀 デプロイ

GitHub Pagesを使用して自動デプロイ：

1. リポジトリの設定でGitHub Pagesを有効化
2. ソースを「Deploy from a branch」に設定
3. ブランチを「main」に設定
4. 自動的にデプロイが実行される

## 🔍 パフォーマンス最適化

- **画像遅延読み込み**: `loading="lazy"`属性を使用
- **キャッシュ**: 商品データを5分間キャッシュ
- **デバウンス**: 検索入力のデバウンス処理
- **フォールバック**: 画像読み込み失敗時の代替表示
- **エラーハンドリング**: 堅牢なエラー処理

## 🐛 トラブルシューティング

### 画像が表示されない場合

1. Google Driveの共有設定を確認
2. ファイルIDが正しいか確認
3. ブラウザのコンソールでエラーログを確認
4. デバッグモードで画像URLテストを実行

### 商品データが読み込まれない場合

1. Google Sheetsの公開設定を確認
2. CSV URLが正しいか確認
3. ネットワーク接続を確認
4. ブラウザのコンソールでエラーログを確認

## 📝 ライセンス

MIT License

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。

## 📞 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。