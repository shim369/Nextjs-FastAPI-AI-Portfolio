# Nextjs-FastAPI-AI-Portfolio

[English](README.md) | 日本語

Shinpei Ohtani の総合ポートフォリオサイトです。経歴・スキル・制作物・Jamstack の実装・ブログ・サイトの仕組みを1ページにまとめ、ページ上の AI チャットで経歴について質問できます。

**サイト：https://nextjs-fastapi-ai-portfolio.vercel.app**

- 画面：Next.js（App Router・TypeScript）。和の組版をテーマにした1ページ構成
- API：FastAPI（Python）。AI チャット（Gemini の function calling を使った手書きのエージェントループ）とお問い合わせ
- ホスティング：Vercel の1つのプロジェクトに、frontend と backend の2サービスを載せる
- AI チャット・お問い合わせの仕組みは [Python-AI-Chat](https://github.com/shim369/Python-AI-Chat) から引き継いでいる

## ページの構成

| セクション | 内容 |
|---|---|
| Hero | 署名・見出し・AI への質問バーと、一筆で伸びて花が開く墨の梅の枝。下端に「できること」3つ |
| 技能 | Python を主役のパネルで。「Python でできること」の4領域（押すと該当する制作物をモーダルで表示）と、「土台にある技術」の4列 |
| 制作 | 代表作3つを、仕組みの図・作った理由・工夫した点とあわせて紹介し、その下に「その他の制作物」 |
| 実装 | 黒漆の帯。microCMS × 5フレームワークの Jamstack サイトを、View Transition で切り替えて比べる |
| 記録 | 技術ブログ「TECH BLOG」の最新3件（microCMS から取得・ISR） |
| 仕組 | このサイトの構成図と設計メモ |
| 連絡 | reCAPTCHA v3 付きのお問い合わせフォーム |

### 実装欄の Jamstack サイト

どれも同じ microCMS（エンドポイント `blogs`）を使い、記事の更新がサイトに届くまでの方式を比べられます。

| サイト | フレームワーク | 方式 | リポジトリ |
|---|---|---|---|
| NUXT BASE | Nuxt 4 | SSR | [Nuxtjs-TypeScript-Gsap-MicroCMS-Site](https://github.com/shim369/Nuxtjs-TypeScript-Gsap-MicroCMS-Site) |
| ASTRO BASE | Astro 7 | SSG | [Astro-MicroCMS-Site](https://github.com/shim369/Astro-MicroCMS-Site) |
| SVELTE BASE | SvelteKit 3 | SSG | [SvelteKit-TypeScript-MicroCMS-Site](https://github.com/shim369/SvelteKit-TypeScript-MicroCMS-Site) |
| NEXT BASE | Next.js 16 | ISR（Webhook で再検証） | [Nextjs-TypeScript-MicroCMS-Site](https://github.com/shim369/Nextjs-TypeScript-MicroCMS-Site) |
| GATSBY BASE | Gatsby 5 | SSG | [Gatsby-TypeScript-Threejs-MicroCMS-Site](https://github.com/shim369/Gatsby-TypeScript-Threejs-MicroCMS-Site) |

一覧・説明文は `frontend/lib/config.ts` の `JAMSTACK`、スクリーンショットは `frontend/public/images/jamstack/`（各デモのファーストビューを撮ったもの）、AI チャット用のデータは `backend/app/data/profile.json` にあります。サイトを変えたら3か所をそろえてください。

### 共通の部品

左の縦書きナビ（スマホでは画面下のバー）、上の柱（東京の現在時刻・言語切り替え）、⌘K / Ctrl+K のパレット（AI への質問とページ内の移動）、右から出る AI チャットパネルがあります。日本語と英語に対応し、既定は日本語です。

## 構成図

```
ブラウザ
  │
  ▼
Vercel（1プロジェクト）
  ├─ /api/*  → backend サービス（FastAPI, backend/app/main.py）
  │             ├─ POST /api/chat     … エージェントループ ⇄ Gemini API
  │             │                       ツール：profile.json / ブログ（microCMS）
  │             ├─ POST /api/contact  … reCAPTCHA v3 の検証 → SMTP で送信
  │             └─ GET  /api/health
  └─ /*      → frontend サービス（Next.js, frontend/）
                └─ 記録欄：microCMS（blogs）をサーバー側で取得し、ISR（60秒）で配信
```

```
.
├─ vercel.json            # services（frontend / backend）と rewrites（/api/* → backend）
├─ .vercelignore          # CLI から直接デプロイしたときに、.env やデザイン案をアップロードしない
├─ .github/workflows/     # CI（backend：Ruff・Mypy・pytest／frontend：lint・型チェック・ビルド）
├─ backend/               # FastAPI。app/（agent.py, llm.py, tools.py, blog.py, contact.py …）と tests/
│                         #   app/data/profile.json … AI チャットが答える経歴データ
└─ frontend/              # Next.js。app/, components/（chrome / sections / svg）, lib/, styles/（SCSS の partial）
                          #   lib/config.ts … ページに載せるデータ、lib/messages.ts … 日英の文言
```

## ローカルでの起動

必要なもの：[uv](https://docs.astral.sh/uv/)（Python 3.14 は uv が用意します）、Node.js 24

```bash
# 1. backend（http://127.0.0.1:8000）
cd backend
cp .env.example .env        # 値を書き込む（下の「環境変数」）
uv sync
uv run --env-file .env uvicorn app.main:app --reload --port 8000

# 2. frontend（http://127.0.0.1:3000）。開発中は /api/* を 8000 番の FastAPI へ転送する
cd frontend
cp .env.example .env.local  # 値を書き込む（.env でも可）
npm install
npm run dev
```

チェック：

```bash
cd backend  && uv run ruff check . && uv run mypy && uv run pytest
cd frontend && npm run lint && npm run typecheck && npm run build
```

## 環境変数

値はコードやコミットに入れず、ローカルでは `backend/.env` と `frontend/.env.local`（または `frontend/.env`）、本番では Vercel の Environment Variables に設定します（`.env.example` には項目名だけを書いています）。

- backend は `.env` を自動では読まないため、`uv run --env-file .env` で起動します。
- 値に空白を含めないでください（Gmail のアプリパスワードは空白を取って書きます）。空白があると `.env` 全体が読み込まれません。
- microCMS の2項目は、記録欄（frontend）とチャットのツール（backend）の両方が使うため、ローカルでは両方の `.env` に同じ値を書きます。Vercel では1か所の設定を両方が読みます。

| 変数 | 使う場所 | 必須 | 内容 |
|---|---|---|---|
| `GEMINI_API_KEY` | backend | ○ | Gemini API キー（AI チャット） |
| `GEMINI_MODEL` | backend | | モデル名（既定は `app/config.py`） |
| `CONTACT_TO_EMAIL` / `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | backend | ○ | お問い合わせの送信先と SMTP（Gmail はアプリパスワード） |
| `RECAPTCHA_SECRET_KEY` | backend | ○ | reCAPTCHA v3 のシークレットキー（空なら検証しない） |
| `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` | frontend・backend | ○ | TECH BLOG の microCMS（記録欄と、チャットの `get_blog_posts`）。API キーは GET 権限だけにする |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | frontend | ○ | reCAPTCHA v3 のサイトキー。`RECAPTCHA_SECRET_KEY` と同じキーの組にする（空なら `lib/config.ts` の既定値）。ビルド時に埋め込まれるため、Vercel でも設定し、変えたら再デプロイする |
| `NEXT_PUBLIC_SITE_URL` | frontend | | 本番 URL（OGP・canonical 用） |

レート制限・タイムアウトなどの調整値は `backend/.env.example` を参照してください。

## デプロイ（Vercel）

1. Vercel でこのリポジトリを Import する（Framework Preset は自動判定。ルートの `vercel.json` の services で frontend / backend の2サービスとしてビルドされる）
2. 上の環境変数を Production（と Preview）に設定する
3. reCAPTCHA の管理画面で、キーの種類が **v3** であることを確かめ、ドメインに本番のドメイン・`localhost`・`127.0.0.1` を追加する（`localhost` と `127.0.0.1` は別のドメインとして扱われる）
4. Vercel と GitHub を連携しておくと、`main` に push するたびに本番へデプロイされる。GitHub Actions（`.github/workflows/nextjs-fastapi-ai-portfolio.yml`）で backend の Ruff・Mypy・pytest と、frontend の lint・型チェック・ビルドを実行する

## 運用メモ

- **Jamstack のスクリーンショット**：Vercel Services の構成では Next.js の画像最適化（`/_next/image`）が 404 になるため、`next/image` に `unoptimized` を付けて、あらかじめ縮めた webp をそのまま配信しています。
- **デザイン案**：HTML のデザイン案は `.local/` に置きます。`.gitignore` と `.vercelignore` で除外しているので、GitHub にも Vercel にも上がりません。
- **お問い合わせの不具合を調べるとき**：backend のログに `contact_failed` と原因のコード（例：`recaptcha_failed`・`browser-error`）が出ます。氏名・メールアドレス・本文はログに残しません。

AI チャットは Gemini API の無料枠で運用しているため、規約に合わせて EEA・スイス・英国からの利用を止めています（`backend/app/region.py`）。
