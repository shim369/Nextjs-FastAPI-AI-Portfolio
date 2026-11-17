# Nextjs-FastAPI-AI-Portfolio

[English](README.md) | 日本語

Shinpei Ohtani の総合ポートフォリオサイトです。経歴・スキル・制作物・Jamstack の実装・ブログ・サイトの仕組みを1ページにまとめ、ページ上の AI チャットで経歴について質問できます。

- 画面：Next.js（App Router・TypeScript）。和の組版をテーマにした1ページ構成
- API：FastAPI（Python）。AI チャット（Gemini の function calling を使った手書きのエージェントループ）とお問い合わせ
- ホスティング：Vercel の1つのプロジェクトに、frontend と backend の2サービスを載せる
- AI チャット・お問い合わせの仕組みは [Python-AI-Chat-Portfolio](https://github.com/shim369/Python-AI-Chat-Portfolio) から引き継いでいる

## ページの構成

| セクション | 内容 |
|---|---|
| Hero | 名前の組版、縦書きのキャッチ、流れるすやり霞、AI への質問バー |
| 技能 | Python を主役のパネルで、ほかを「土台にある技術」として4列で |
| 制作 | 目録風の一覧。ホバー・フォーカスで行が開く（スマホでは最初から開く） |
| 実装 | 黒漆の帯。microCMS × 6フレームワークの Jamstack サイトを、View Transition で切り替えて比べる |
| 記録 | 技術ブログ「TECH BLOG」の最新3件（microCMS から取得・ISR） |
| 仕組 | このサイトの構成図と設計メモ |
| 連絡 | reCAPTCHA v3 付きのお問い合わせフォーム |

共通の部品として、左の縦書きナビ（スマホでは画面下のバー）、上の柱（東京の現在時刻・言語切り替え）、⌘K / Ctrl+K のパレット（AI への質問とページ内の移動）、右から出る AI チャットパネルがあります。日本語と英語に対応し、既定は日本語です。

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
  │             ├─ GET  /api/blog     … TECH BLOG の最新記事（microCMS）
  │             └─ GET  /api/health
  └─ /*      → frontend サービス（Next.js, frontend/）
                └─ 記録欄：microCMS（blogs）をサーバー側で取得し、ISR（60秒）で配信
```

```
.
├─ vercel.json            # services（frontend / backend）と rewrites（/api/* → backend）
├─ backend/               # FastAPI。app/（agent.py, llm.py, tools.py, blog.py, contact.py …）と tests/
└─ frontend/              # Next.js。app/, components/（chrome / sections / svg）, lib/, styles/（SCSS の partial）
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
cp .env.example .env.local  # 値を書き込む
npm install
npm run dev
```

チェック：

```bash
cd backend  && uv run ruff check . && uv run mypy && uv run pytest
cd frontend && npm run lint && npm run typecheck && npm run build
```

## 環境変数

値はコードやコミットに入れず、ローカルでは `backend/.env` と `frontend/.env.local`、本番では Vercel の Environment Variables に設定します（`.env.example` には項目名だけを書いています）。backend は `.env` を自動では読まないため、`uv run --env-file .env` で起動します。値に空白を含めないでください（Gmail のアプリパスワードは空白を取って書きます）。

| 変数 | 使う場所 | 必須 | 内容 |
|---|---|---|---|
| `GEMINI_API_KEY` | backend | ○ | Gemini API キー（AI チャット） |
| `GEMINI_MODEL` | backend | | モデル名（既定は `app/config.py`） |
| `CONTACT_TO_EMAIL` / `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | backend | ○ | お問い合わせの送信先と SMTP（Gmail はアプリパスワード） |
| `RECAPTCHA_SECRET_KEY` | backend | ○ | reCAPTCHA v3 のシークレットキー（空なら検証しない） |
| `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` | frontend・backend | ○ | TECH BLOG の microCMS（記録欄と、チャットの `get_blog_posts`）。API キーは GET 権限だけにする |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | frontend | | reCAPTCHA v3 のサイトキー（空なら `lib/config.ts` の既定値） |
| `NEXT_PUBLIC_SITE_URL` | frontend | | 本番 URL（OGP・canonical 用） |

レート制限・タイムアウトなどの調整値は `backend/.env.example` を参照してください。

## デプロイ（Vercel）

1. Vercel でこのリポジトリを Import する（Framework Preset は自動判定。ルートの `vercel.json` の services で frontend / backend の2サービスとしてビルドされる）
2. 上の環境変数を Production（と Preview）に設定する
3. reCAPTCHA の管理画面で、本番のドメインをサイトキーに追加する
4. `main` に push するとデプロイされる。GitHub Actions（`.github/workflows/nextjs-fastapi-ai-portfolio.yml`）で backend の Ruff・Mypy・pytest と、frontend の lint・型チェック・ビルドを実行する

AI チャットは Gemini API の無料枠で運用しているため、規約に合わせて EEA・スイス・英国からの利用を止めています（`backend/app/region.py`）。
