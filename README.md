# LinkBox

よく使うURLを保存し、すぐにアクセスできる個人向けリンク管理アプリ。

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

## ビルド

```bash
npm run build
npm start
```

## 機能

- **URL追加** — URLを貼るだけで即座に保存（https://省略可）
- **メタ情報取得** — サイトタイトルとfaviconを自動取得
- **検索** — タイトル・URLでリアルタイムフィルタリング
- **削除** — カードにホバーして×ボタンで削除
- **データ保存** — ブラウザのLocalStorageに保存（サーバー不要）
- **ダークモード** — OSの設定に自動対応

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- React 19
