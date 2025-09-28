# Pierrot - レディースファッションSHOP

![Pierrot Logo](images/Image_001.png)

## 📖 プロジェクト概要

Pierrot（ピエロ）は、上質で洗練されたレディースファッションを提供するオンラインショップのWebサイトです。美しいデザインと使いやすいインターフェースで、お客様に最高のショッピング体験をお届けします。

## ✨ 特徴

* 🎨 **美しいデザイン**: 優雅で洗練されたUI/UX
* 📱 **レスポンシブ対応**: モバイル・タブレット・デスクトップ対応
* ⚡ **高速表示**: 最適化されたパフォーマンス
* 🎯 **ユーザビリティ**: 直感的で使いやすいインターフェース
* 🌸 **ブランドアイデンティティ**: レディースファッションに特化したデザイン
* 📊 **Google Sheets連携**: 商品データをスプレッドシートで管理
* 🖼️ **Google Drive画像**: 商品画像をGoogle Driveで管理

## 🛠️ 技術スタック

* **HTML5**: セマンティックなマークアップ
* **CSS3**: モダンなスタイリング（Flexbox, Grid, アニメーション）
* **JavaScript (ES6+)**: インタラクティブな機能
* **Google Fonts**: 美しい日本語フォント
* **Google Sheets API**: 商品データ管理
* **Google Drive API**: 画像管理

## 🚀 機能

### メイン機能

* スムーズスクロールナビゲーション
* 動的商品カタログの表示（Google Sheets連携）
* 商品詳細モーダル
* レスポンシブデザイン
* 商品検索・フィルタ機能
* カテゴリ別表示
* 価格表示

### インタラクティブ機能

* モバイルハンバーガーメニュー
* フローティングボタン（メニュー、おすすめ、テキストサイズ変更）
* タッチジェスチャー対応（スワイプナビゲーション）
* 商品番号クリック時の詳細表示
* リアルタイム検索
* ソート機能

## 📁 プロジェクト構造

```
pierrot-hp/
├── index.html              # メインHTMLファイル
├── config.js               # 環境設定ファイル
├── product-manager.js      # 商品管理クラス
├── product-display.js      # 商品表示クラス
├── css/
│   └── styles.css          # CSSスタイルシート
├── js/
│   └── script.js           # JavaScript機能
├── images/                 # メイン画像
│   ├── Image_001.png       # ヒーロー画像
│   └── Image_002.png       # 装飾画像
└── README.md               # プロジェクト説明
```

## 🎨 デザインコンセプト

### カラーパレット

* **プライマリ**: #947962 (優雅なブラウン)
* **セカンダリ**: #F8E8E4 (ソフトピンク)
* **アクセント**: #B8A082 (ゴールドブラウン)

### タイポグラフィ

* **見出し**: Noto Serif JP (明朝体)
* **本文**: Noto Sans JP (ゴシック体)

## 🚀 セットアップ

1. リポジトリをクローン

```bash
git clone https://github.com/yamamoto-ayano/pierrot-hp.git
cd pierrot-hp
```

2. ローカルサーバーで実行

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx serve .

# または、Live Server拡張機能を使用
```

3. ブラウザで `http://localhost:8000` にアクセス

## 🌐 デプロイ

このプロジェクトはGitHub Pagesでデプロイされています。

**ライブサイト**: [https://yamamoto-ayano.github.io/pierrot-hp/](https://yamamoto-ayano.github.io/pierrot-hp/)

### GitHub Pages設定

1. リポジトリの「Settings」タブに移動
2. 左サイドバーの「Pages」をクリック
3. 「Source」で「Deploy from a branch」を選択
4. 「Branch」で「main」を選択
5. 「Save」をクリック

## 📊 商品管理

### Google Sheets連携

商品データはGoogle Sheetsで管理されています：

- **スプレッドシートURL**: [商品データ](https://docs.google.com/spreadsheets/d/e/2PACX-1vSWEfEH0eOxllBLT0rFbvTXC8aUE_Xgi0NtBmW_sp9gqSyGmCAsXttFQ2EHQULlQckiZKv42mFBTvVs/pub?output=csv)
- **画像管理**: Google Driveで管理
- **リアルタイム更新**: スプレッドシートの変更が自動反映

### 商品データ構造

| カラム名 | 説明 | 例 |
|---------|------|-----|
| category | カテゴリ | A, B, C... |
| sku | 商品コード | 1a, 2a, 3a... |
| name | 商品名 | 商品名 |
| price | 価格 | 5000 |
| image_file_ids | Google Drive画像ID | 1ABC123... |
| last_updated | 最終更新日 | 2024-01-01 |

## 📱 対応デバイス

* **デスクトップ**: 1200px以上
* **タブレット**: 768px - 1199px
* **モバイル**: 767px以下

## 🎯 今後の予定

* ショッピングカート機能
* ユーザーアカウント機能
* 決済システム連携
* 多言語対応
* 商品レビュー機能
* お気に入り機能

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 👥 貢献

プルリクエストやイシューの報告を歓迎します！

## 📞 お問い合わせ

プロジェクトに関するご質問やご提案がございましたら、お気軽にお問い合わせください。

---

**Pierrot** - 上質で洗練されたレディースファッションをお届けします ✨