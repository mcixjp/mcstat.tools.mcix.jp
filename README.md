# MC Status Next.js Frontend

Minecraft Java Edition サーバーステータス確認フロントエンド。

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **CSS Modules**

## セットアップ

```bash
npm install
npm run dev   # http://localhost:3000
```

## ビルド・デプロイ

```bash
npm run build
npm run start
```

Vercel / Cloudflare Pages にそのままデプロイ可能です。

## API エンドポイント

`src/lib/api.ts` の `API_BASE` で設定済みです：

```ts
const API_BASE = "https://api.mcstat.tools.mcix.jp";
```

変更が必要な場合はこのファイルを編集してください。

## ファイル構成

```
src/
├── app/
│   ├── layout.tsx       # ルートレイアウト・メタデータ
│   ├── page.tsx         # メインページ（状態管理）
│   ├── page.module.css
│   └── globals.css      # テーマ変数・共通スタイル
├── components/
│   ├── SearchBar.tsx    # ホスト・ポート入力
│   ├── StarField.tsx    # 夜空の背景
│   └── StatusCard.tsx   # サーバー情報カード
├── lib/
│   └── api.ts           # APIクライアント
└── types/
    └── api.ts           # レスポンス型定義
```
