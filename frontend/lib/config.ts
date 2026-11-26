/*
 * ページに載せるデータ。経験年数や制作物はここを書き換えるだけで反映されます。
 * 言語によって変わる値は { ja: "...", en: "..." } の形で書きます。
 * （AIチャットが参照する経歴データは backend/app/data/profile.json です。内容を変えたら両方そろえてください）
 */
export type Localized = { ja: string; en: string };

export type Skill = { name: string; years: Localized; note: Localized };
export type Project = {
  title: string;
  summary: Localized;
  /** 目録の左に出る分類 */
  category: Localized;
  tech: string[];
  url: string;
  /** 公開しているデモがあるときだけ */
  demo?: string;
};
export type JamSite = {
  name: string;
  fw: string;
  /** 記事の更新の届け方。LANES のキー（SSG / ISR / SSR）を含む文字列 */
  render: string;
  repo: string;
  demo: string;
  /** public/images/jamstack/ のファイル名（拡張子なし） */
  img: string;
  /** 画像の縦横（next/image に渡す）。各デモのファーストビューを 1440×647 で撮影したもの */
  size: [number, number];
  tech: string[];
  note: Localized;
};

export const GITHUB_URL = "https://github.com/shim369";
// 技術ブログ「TECH BLOG」（Astro + microCMS）。記事の取得は lib/microcms.ts
export const BLOG_URL = "https://astro-microcms-blogs.vercel.app/";

// 先頭の Python を「いま、いちばん力を入れている技術」として大きく見せ、残りを「土台にある技術」に並べる
export const SKILLS: Skill[] = [
  {
    name: "Python",
    years: { ja: "5ヶ月", en: "5 mos" },
    note: {
      ja: "実務では業務効率化ツール2件（PHPバージョンアップ支援、Webサイト調査）をスクラッチで設計・開発・運用。個人開発では2023年からFastAPI・Streamlit・Djangoなどで継続的に開発",
      en: "At work: designed, built and operate two automation tools from scratch (PHP upgrade support, website survey). Personal projects with FastAPI, Streamlit, Django and more since 2023",
    },
  },
  {
    name: "TypeScript / React",
    years: { ja: "5ヶ月", en: "5 mos" },
    note: {
      ja: "生産管理システムのWebアプリ機能追加（端末設定・表示設定）、結合テスト",
      en: "New features (device and display settings) for a production management web app, integration testing",
    },
  },
  {
    name: "C# / .NET (ASP.NET)",
    years: { ja: "11ヶ月", en: "11 mos" },
    note: {
      ja: ".NETバージョンアップ、社内業務ツール（採用管理・給与計算・従業員情報）の解析・改修、ECサイト改修",
      en: ".NET upgrades, analysis and improvement of internal tools (recruiting, payroll, employee data), e-commerce site changes",
    },
  },
  {
    name: "JavaScript / jQuery",
    years: { ja: "8年6ヶ月", en: "8 yrs 6 mos" },
    note: {
      ja: "Webサイト制作・改修全般、Electron / Node.jsのデスクトップアプリ開発、ASP.NET ECサイトのフロントエンド対応",
      en: "Website development and maintenance, Electron / Node.js desktop apps, frontend work on an ASP.NET e-commerce site",
    },
  },
  {
    name: "PHP",
    years: { ja: "6年8ヶ月", en: "6 yrs 8 mos" },
    note: {
      ja: "WordPressテーマ制作・改修、CakePHP 2系 / Smartyの改修、PHP 5〜7系サイトのPHP 8.4移行対応",
      en: "WordPress themes, CakePHP 2 / Smarty maintenance, migrating PHP 5–7 sites to PHP 8.4",
    },
  },
  {
    name: "HTML / CSS (Sass)",
    years: { ja: "8年3ヶ月", en: "8 yrs 3 mos" },
    note: {
      ja: "コーポレート・EC・LP・イントラサイトのデザイン / コーディング、cshtml / aspxへの組み込み",
      en: "Design and coding of corporate, e-commerce, landing and intranet sites; integration into cshtml / aspx",
    },
  },
  {
    name: "WordPress",
    years: { ja: "5年7ヶ月", en: "5 yrs 7 mos" },
    note: {
      ja: "テーマ制作・サイト構築、本体・プラグインの改修（開発停止プラグインを含む）",
      en: "Theme development and site builds, core and plugin maintenance (including discontinued plugins)",
    },
  },
  {
    name: "MySQL / MariaDB",
    years: { ja: "7年6ヶ月", en: "7 yrs 6 mos" },
    note: { ja: "Webサイト・CMSのデータベース", en: "Databases behind websites and CMSs" },
  },
  {
    name: "Git (GitHub / GitLab)",
    years: { ja: "3年9ヶ月", en: "3 yrs 9 mos" },
    note: {
      ja: "ブランチ戦略に基づくマージ・リリース調整、フルリモートでのチーム開発",
      en: "Merges and release coordination under a branching strategy, fully remote team development",
    },
  },
];

// Python の主役パネルに並べる関連ライブラリの候補。Python の制作物で使っているもの（と Django）だけを表示する
export const PYTHON_LIBRARIES = [
  "FastAPI", "Streamlit", "Django", "Pydantic", "SQLAlchemy", "pytest", "Mypy",
  "Playwright", "PyTorch", "LightGBM", "OpenCV", "Gemini API",
];

// 制作物（デザイン案のデータの順。Jamstack のサイトは JAMSTACK に載せ、ここには重複して載せない）
export const PROJECTS: Project[] = [
  {
    title: "Python-Web-Analyzer",
    category: { ja: "業務ツール", en: "Work tool" },
    summary: {
      ja: "Excelのドメイン一覧からSSL対応・CMS・ページ数を並列クロールで解析し、評価を付けるStreamlitアプリ。状態をSQLiteに保存し、強制終了後も復旧します。",
      en: "A Streamlit app that crawls a list of domains in parallel to detect SSL, CMS and page count, then rates each site. State is saved in SQLite.",
    },
    tech: ["Python", "Streamlit", "SQLite", "Playwright", "HTTPX", "Gemini API"],
    url: "https://github.com/shim369/Python-Web-Analyzer",
  },
  {
    title: "Python-Health-Insight-Agent",
    category: { ja: "AIエージェント", en: "AI agent" },
    summary: {
      ja: "食事・運動・睡眠ログを分析するAIエージェント。Gemini が説明し、統計は型付きツールで計算して根拠つきで回答します。RAGやMCPサーバーも備えます。",
      en: "An AI agent that analyzes meal, workout and sleep logs. Gemini explains, typed tools compute the statistics, and answers cite evidence. Includes RAG and MCP.",
    },
    tech: ["Python", "FastAPI", "Gemini API", "PostgreSQL", "LightGBM", "React", "Docker"],
    url: "https://github.com/shim369/Python-Health-Insight-Agent",
  },
  {
    title: "Python-AI-Chat",
    category: { ja: "AIチャット", en: "AI chat" },
    summary: {
      ja: "AIチャットの制作物。Gemini の function calling を使った手動エージェントループのAIチャットを、Vercel 上の FastAPI と Next.js で動かしています。このサイトのチャットの仕組みも、ここから引き継いでいます。",
      en: "An AI chat project: a hand-written agent loop with Gemini function calling, running on FastAPI and Next.js on Vercel. The chat on this site is built on the same foundation.",
    },
    tech: ["Python", "FastAPI", "Gemini API", "Next.js", "TypeScript"],
    url: "https://github.com/shim369/Python-AI-Chat",
    demo: "https://python-ai-chat-portfolio.vercel.app",
  },
  {
    title: "Python-Defect-Hunter-Game",
    category: { ja: "画像認識", en: "Computer vision" },
    summary: {
      ja: "表面欠陥データセット KolektorSDD2 を使った「人間 vs AI」のブラウザゲーム。CPUで学習した小さな U-Net と人間が同じ画像の欠陥をなぞり、IoU で比較します。",
      en: "A Human vs AI browser game on the KolektorSDD2 surface-defect dataset. You and a small CPU-trained U-Net trace the same defect, and both are scored by IoU.",
    },
    tech: ["Python", "PyTorch", "FastAPI", "OpenCV", "Docker"],
    url: "https://github.com/shim369/Python-Defect-Hunter-Game",
  },
  {
    title: "Python-PawMatch-Guard",
    category: { ja: "投稿審査AI", en: "AI moderation" },
    summary: {
      ja: "犬猫の里親マッチングアプリ。投稿画像を分類・検出・セグメンテーションの3つのモデルで審査し、「公開・要確認・却下」を判定。迷うものは人の確認に回す。",
      en: "A pet-adoption matching app whose posts pass an AI moderation pipeline: classification, detection and segmentation models decide publish / needs review / reject, and uncertain cases go to a human.",
    },
    tech: ["Python", "PyTorch", "FastAPI", "ONNX", "Docker", "Terraform", "pytest"],
    url: "https://github.com/shim369/Python-PawMatch-Guard",
  },
  {
    title: "Python-Smart-Health-Intelligence-Platform",
    category: { ja: "ヘルスケア", en: "Healthcare" },
    summary: {
      ja: "開発中のマルチユーザー向け健康管理Webアプリ。ルールベースの提案、Gemini によるレシピ生成、LightGBM による体重予測、Google認証を備えます。",
      en: "A multi-user health tracking web app (in progress) with rule-based recommendations, Gemini recipe generation, LightGBM weight prediction and Google sign-in.",
    },
    tech: ["Python", "Streamlit", "PostgreSQL", "SQLAlchemy", "LightGBM", "Gemini API"],
    url: "https://github.com/shim369/Python-Smart-Health-Intelligence-Platform",
  },
  {
    title: "Python-Budget-Tracker-App",
    category: { ja: "家計簿アプリ", en: "Budget app" },
    summary: {
      ja: "オフラインで動く家計簿・サブスク管理アプリ。FastAPI と Pydantic で作り、設計書とトレーサビリティを整備し、336件のテストでカバレッジ99.9%。",
      en: "An offline budget and subscription tracker built with FastAPI and Pydantic, backed by design docs, traceability, and 336 tests at 99.9% coverage.",
    },
    tech: ["Python", "FastAPI", "Pydantic", "Alpine.js", "pytest"],
    url: "https://github.com/shim369/Python-Budget-Tracker-App",
  },
  {
    title: "Python-Encryption-Tool",
    category: { ja: "セキュリティ", en: "Security" },
    summary: {
      ja: "ファイル・フォルダを一括で暗号化 / 復号するデスクトップツール。ソルトとストレッチングによる鍵の強化、Mypy Strict 準拠の型付け、GitHub Actions での CI。",
      en: "A desktop tool that encrypts and decrypts files and whole folders, with salted, stretched keys, Mypy-strict typing and CI on GitHub Actions.",
    },
    tech: ["Python", "cryptography", "CustomTkinter", "Mypy", "GitHub Actions"],
    url: "https://github.com/shim369/Python-Encryption-Tool",
  },
  {
    title: "Nextjs-TypeScript-AspNetCore-Todo-App",
    category: { ja: "Webアプリ", en: "Web app" },
    summary: {
      ja: "Next.js（TypeScript）のフロントエンドと ASP.NET Core（MVC）のバックエンドを分離したフルスタックの Todo アプリ。データは SQLite に保存します。",
      en: "A full-stack Todo app with a Next.js (TypeScript) frontend decoupled from an ASP.NET Core (MVC) backend, storing its data in SQLite.",
    },
    tech: ["TypeScript", "Next.js", "C#", "ASP.NET Core", "SQLite"],
    url: "https://github.com/shim369/Nextjs-TypeScript-AspNetCore-Todo-App",
  },
];

// 制作欄の代表作：作った理由と工夫した点（profile.json の記述をもとに書く）。図は components/svg/FeatureArt.tsx
/** atWork：実務で使っている制作物に「実務で使用」の札を付ける */
export type Featured = { title: string; why: Localized; points: Localized[]; atWork?: boolean };
export const FEATURED: Featured[] = [
  {
    title: "Python-Web-Analyzer",
    atWork: true,
    why: {
      ja: "リニューアルの提案先を決めるために、多くのサイトを1件ずつ開いて、SSL・CMS・ページ数を調べていました。この作業をExcelのドメイン一覧から自動で調べ、評価まで付けるツールにして、実務で使っています。",
      en: "To choose which companies to pitch a site renewal to, I used to open site after site and check its SSL, CMS and page count by hand. I turned that into a tool that works through an Excel list of domains and rates each site, and I use it at work.",
    },
    points: [
      {
        ja: "ThreadPoolExecutor で最大5並列に巡回。1件で失敗しても、ほかのドメインとジョブ全体は止めない",
        en: "Crawls up to five domains in parallel with ThreadPoolExecutor. A failure on one domain stops neither the others nor the job",
      },
      {
        ja: "結果は1件ごとに SQLite（WAL）へ保存し、強制終了しても次の起動で処理状態を復旧",
        en: "Each result is saved to SQLite (WAL) as it finishes, so the next launch restores the job even after a forced quit",
      },
      {
        ja: "ボット対策のブロックページ・移転案内・無限リンクを検知して「要確認」に回し、取り損ねは Gemini で補完",
        en: "Bot-blocking pages, moved-site notices and infinite link traps are detected and flagged for review, and anything missed is filled in with Gemini",
      },
    ],
  },
  {
    title: "Python-Health-Insight-Agent",
    why: {
      ja: "AIに数字を計算させると、もっともらしい間違いが混ざります。そこで「計算はコード、説明はAI」と役割を分け、答えの根拠を必ず示すデータ分析エージェントにしました。",
      en: "When an AI does the arithmetic, plausible mistakes creep in. So I split the roles, with code doing the math and AI doing the explaining, and built a data-analysis agent that always shows the evidence behind its answers.",
    },
    points: [
      {
        ja: "統計は型付きツールで計算し、どのデータ・何件・どの統計かという根拠つきで回答",
        en: "Statistics are computed by typed tools, and answers cite which data, how many rows and which statistic",
      },
      {
        ja: "ノートへの RAG と、読み取り専用の安全な SQL でデータを参照",
        en: "Data is read through RAG over notes and safe, read-only SQL",
      },
      {
        ja: "LightGBM の予測モデルは、ベースラインを一定以上上回らなければ採用しない",
        en: "The LightGBM model is adopted only if it beats a baseline by a set margin",
      },
    ],
  },
  {
    title: "Python-Defect-Hunter-Game",
    why: {
      ja: "画像認識の精度は、数字だけ見ても実感しにくいものです。人間とAIが同じ画像で欠陥を探して比べるゲームにすれば、AIの得意・不得意を体で理解できると考えました。",
      en: "Image-recognition accuracy is hard to feel from numbers alone. A game in which a human and an AI hunt for the same defect lets you experience first-hand what the AI is good and bad at.",
    },
    points: [
      {
        ja: "人間がなぞった欠陥と、CPU で学習した小さな U-Net の予測を IoU で並べて比較",
        en: "Defects traced by a human and predictions from a small CPU-trained U-Net are compared side by side by IoU",
      },
      {
        ja: "評価指標の IoU / F1 をライブラリに頼らず自前で実装",
        en: "IoU and F1 are implemented from scratch instead of taken from a library",
      },
      {
        ja: "固定シード・uv のロックファイル・Docker で、学習と結果の再現性を確保",
        en: "Fixed seeds, a uv lockfile and Docker keep training and results reproducible",
      },
    ],
  },
];

// 技能欄の「Python でできること」。件数は PROJECTS の使用技術から自動で数える（match のどれかを含む制作物）
export type Domain = { id: string; name: Localized; desc: Localized; match: string[] };
export const DOMAINS: Domain[] = [
  {
    id: "ai",
    name: { ja: "AIエージェント・LLM連携", en: "AI agents & LLM integration" },
    desc: {
      ja: "Gemini の function calling でツールを呼び、根拠つきで答える仕組み",
      en: "Calling tools through Gemini function calling and answering with evidence",
    },
    match: ["Gemini API"],
  },
  {
    id: "ml",
    name: { ja: "データ分析・機械学習", en: "Data analysis & machine learning" },
    desc: {
      ja: "LightGBM での予測や、PyTorch・OpenCV での画像認識",
      en: "Forecasting with LightGBM and image recognition with PyTorch and OpenCV",
    },
    match: ["PyTorch", "LightGBM", "OpenCV"],
  },
  {
    id: "web",
    name: { ja: "Web API・Webアプリ", en: "Web APIs & web apps" },
    desc: {
      ja: "FastAPI や Streamlit で、使える形まで仕上げて公開する",
      en: "Finished into usable, published apps with FastAPI or Streamlit",
    },
    match: ["FastAPI", "Streamlit", "Django"],
  },
  {
    id: "qa",
    name: { ja: "テスト・品質管理", en: "Testing & quality" },
    desc: {
      ja: "pytest・Mypy・Playwright・CI で、壊れにくく保つ",
      en: "Kept robust with pytest, Mypy, Playwright and CI",
    },
    match: ["pytest", "Mypy", "Playwright", "GitHub Actions"],
  },
];
export const projectsInDomain = (d: Domain) => PROJECTS.filter((p) => p.tech.some((t) => d.match.includes(t)));

// 「土台にある技術」を4列に収めるため、長い技術名だけ表示を短くする
export const SHORT_SKILL_NAMES: Record<string, string> = {
  "C# / .NET (ASP.NET)": "C# / ASP.NET",
  "Git (GitHub / GitLab)": "Git / GitHub",
};

// 同じ microCMS を、フレームワークを変えて組み上げた Jamstack サイト
export const JAMSTACK: JamSite[] = [
  {
    name: "NUXT BASE", fw: "Nuxt 4", render: "SSR", repo: "Nuxtjs-TypeScript-Gsap-MicroCMS-Site",
    demo: "https://nuxtbase-gsap.vercel.app", img: "nuxt", size: [1440, 647],
    tech: ["Nuxt 4", "TypeScript", "GSAP", "Nodemailer", "reCAPTCHA v3"],
    note: {
      ja: "Nuxt の Server API を間に挟み、microCMS の APIキーをブラウザに出さない構成。GSAP ScrollTrigger でマスクが広がって現れるヒーローと、遅延 hydration のお問い合わせフォーム。",
      en: "Nuxt's server API sits in between so the microCMS API key never reaches the browser. A GSAP ScrollTrigger hero revealed by a zooming mask, and a lazily hydrated contact form.",
    },
  },
  {
    name: "ASTRO BASE", fw: "Astro 7", render: "SSG", repo: "Astro-MicroCMS-Site",
    demo: "https://astrobase.vercel.app", img: "astro", size: [1440, 647],
    tech: ["Astro 7", "Content Layer", "View Transitions", "GSAP", "microCMS"],
    note: {
      ja: "Content Layer で microCMS の記事をビルド時に取り込み、zod で検証して静的HTMLに。astro:assets で画像を WebP に変換し、ClientRouter で一覧の画像が記事の見出し画像へつながる。",
      en: "Posts are loaded from microCMS into a Content Layer collection at build time, validated with zod and rendered as static HTML. astro:assets converts images to WebP, and the ClientRouter carries each card image into the article.",
    },
  },
  {
    name: "SVELTE BASE", fw: "SvelteKit 3", render: "SSG", repo: "SvelteKit-TypeScript-MicroCMS-Site",
    demo: "https://sveltebase-phi.vercel.app", img: "sveltekit", size: [1400, 694],
    tech: ["SvelteKit 3", "Svelte 5", "TypeScript", "felte", "microCMS"],
    note: {
      ja: "+page.server.ts で記事を取得し、prerender でビルド時に静的HTMLに。山登りに見立てたデザインで、スクロールに合わせて山へズームするヒーローと高度計を備える。",
      en: "Posts are loaded in +page.server.ts and prerendered as static HTML at build time. Designed as a mountain climb, with a scroll-driven hero that zooms into the mountain and an altimeter.",
    },
  },
  {
    name: "NEXT BASE", fw: "Next.js 16", render: "ISR", repo: "Nextjs-TypeScript-MicroCMS-Site",
    demo: "https://nextbase-gsap.vercel.app", img: "nextjs", size: [1440, 647],
    tech: ["Next.js 16", "App Router", "Cache Components", "GSAP", "microCMS"],
    note: {
      ja: "記事は Cache Components（\"use cache\"）でキャッシュして静的に配信し、microCMS の Webhook で revalidateTag を呼んですぐに反映。GSAP の ScrollTrigger でスクロールアニメーションを付け、お問い合わせは Server Action で送信。",
      en: "Posts are cached with Cache Components (\"use cache\") and served as static pages, and a microCMS webhook calls revalidateTag so edits go live right away. Scroll animations use GSAP ScrollTrigger, and the contact form is sent through a Server Action.",
    },
  },
  {
    name: "GATSBY BASE", fw: "Gatsby 5", render: "SSG", repo: "Gatsby-TypeScript-Threejs-MicroCMS-Site",
    demo: "https://gatsbybase.vercel.app", img: "gatsby", size: [1440, 647],
    tech: ["Gatsby 5", "React 19", "Three.js", "GraphQL", "microCMS"],
    note: {
      ja: "microCMS のデータを GraphQL のデータ層に取り込み、File System Route API で記事ページを自動生成。Three.js の惑星がスクロールに合わせて動き、姉妹サイトが衛星として周回する。",
      en: "microCMS data is pulled into Gatsby's GraphQL data layer, and post pages are generated with the File System Route API. A Three.js planet moves as you scroll, with the sister sites orbiting it as satellites.",
    },
  },
];

// ===== 移行（PHP 8.4 移行支援）：components/sections/Migration.tsx =====
// 文中の `...` はコードとして表示する

/** 変更の種類。版の数字（"8.2" など）は、そのまま見出しに出す */
export type MigrationTag = "base" | "deprecated" | "changed" | "removed" | "goal" | `${number}.${number}`;
export type MigrationVersion = {
  v: string;
  /** 物差しの目盛りの下に出す短い注記 */
  note?: Localized;
  /** 移行先の版（朱で示す） */
  goal?: boolean;
  sub: Localized;
  items: { tag: MigrationTag; text: Localized }[];
};

// 版ごとの主な変更（PHP の公式の移行ガイドから、移行の作業でよく出会うものを抜粋）
export const MIGRATION_VERSIONS: MigrationVersion[] = [
  {
    v: "5.4",
    note: { ja: "移行元に多い", en: "Common source" },
    sub: { ja: "多くのレガシーサイトの出発点", en: "Where many legacy sites start" },
    items: [
      {
        tag: "base",
        text: {
          ja: "`mysql_*` 関数・`ereg` 系・`each()` など、後の版でなくなる書き方がまだ普通に使える",
          en: "`mysql_*` functions, the `ereg` family and `each()` still work here, though later versions remove them",
        },
      },
      {
        tag: "base",
        text: {
          ja: "短い配列の書き方 `[]` が使えるようになった版。これより前のコードは `array()` だけ",
          en: "The short array syntax `[]` arrives in this version. Older code uses only `array()`",
        },
      },
    ],
  },
  {
    v: "5.6",
    sub: { ja: "5 系の最後", en: "The last of PHP 5" },
    items: [
      { tag: "deprecated", text: { ja: "`$HTTP_RAW_POST_DATA` が非推奨に", en: "`$HTTP_RAW_POST_DATA` is deprecated" } },
      {
        tag: "changed",
        text: {
          ja: "既定の文字コードが UTF-8 に。`htmlspecialchars()` などの結果が変わることがある",
          en: "The default charset becomes UTF-8, which can change the output of `htmlspecialchars()` and similar functions",
        },
      },
    ],
  },
  {
    v: "7.0",
    note: { ja: "大きな区切り", en: "Major break" },
    sub: { ja: "古い関数がまとめて削除", en: "Old functions removed in bulk" },
    items: [
      {
        tag: "removed",
        text: { ja: "`mysql_*` 関数。`mysqli` か PDO への置き換えが必要", en: "The `mysql_*` functions. Code must move to `mysqli` or PDO" },
      },
      { tag: "removed", text: { ja: "`ereg`・`split` などの POSIX 正規表現", en: "POSIX regular expressions such as `ereg` and `split`" } },
      {
        tag: "deprecated",
        text: {
          ja: "PHP 4 形式のコンストラクタ（クラス名と同じメソッド）は非推奨に",
          en: "PHP 4 style constructors (a method named after the class) are deprecated",
        },
      },
    ],
  },
  {
    v: "7.2",
    sub: { ja: "8.0 で消えるものの予告", en: "Warnings of what 8.0 removes" },
    items: [
      { tag: "deprecated", text: { ja: "`each()` と `create_function()`", en: "`each()` and `create_function()`" } },
      { tag: "changed", text: { ja: "数えられない値を `count()` に渡すと警告", en: "Passing an uncountable value to `count()` raises a warning" } },
      { tag: "removed", text: { ja: "`mcrypt` 拡張（暗号化の関数）", en: "The `mcrypt` extension (encryption functions)" } },
    ],
  },
  {
    v: "7.4",
    note: { ja: "移行元に多い", en: "Common source" },
    sub: { ja: "7 系の最後", en: "The last of PHP 7" },
    items: [
      { tag: "deprecated", text: { ja: "文字列の波カッコでの添字 `$s{0}`", en: "Curly-brace string offsets such as `$s{0}`" } },
      { tag: "deprecated", text: { ja: "かっこの無い三項演算子の入れ子", en: "Nested ternary operators without parentheses" } },
    ],
  },
  {
    v: "8.0",
    note: { ja: "大きな区切り", en: "Major break" },
    sub: { ja: "いちばん壊れやすい区切り", en: "Where sites break most often" },
    items: [
      {
        tag: "removed",
        text: { ja: "`each()`・`create_function()`・`$s{0}` の書き方", en: "`each()`, `create_function()` and the `$s{0}` syntax" },
      },
      {
        tag: "changed",
        text: {
          ja: "多くの警告がエラーに。未定義の関数や型の合わない引数で、ページ全体が止まる",
          en: "Many warnings become errors. An undefined function or a mistyped argument now stops the whole page",
        },
      },
      {
        tag: "changed",
        text: {
          ja: "文字列と数値の比較の結果が変わる（`0 == \"abc\"` が false に）",
          en: "String-to-number comparisons change (`0 == \"abc\"` is now false)",
        },
      },
    ],
  },
  {
    v: "8.1",
    sub: { ja: "null の扱いが厳しく", en: "Stricter about null" },
    items: [
      {
        tag: "deprecated",
        text: {
          ja: "組み込み関数に null を渡すこと（`trim(null)` など）。ログが警告で埋まる",
          en: "Passing null to built-in functions (`trim(null)` and so on). Logs fill up with warnings",
        },
      },
      { tag: "deprecated", text: { ja: "`strftime()` などの日付の関数", en: "Date functions such as `strftime()`" } },
    ],
  },
  {
    v: "8.4",
    note: { ja: "移行先", en: "Target" },
    goal: true,
    sub: { ja: "移行先の版", en: "The target version" },
    items: [
      {
        tag: "8.2",
        text: {
          ja: "クラスに宣言していないプロパティを動的に作ることが非推奨に",
          en: "Creating properties a class does not declare is deprecated",
        },
      },
      {
        tag: "8.4",
        text: {
          ja: "既定値 null で型を暗黙に null 許容にする書き方が非推奨に",
          en: "Making a type implicitly nullable with a null default is deprecated",
        },
      },
      {
        tag: "goal",
        text: {
          ja: "これらの警告とエラーが出ない状態で、すべてのページと機能が動くこと",
          en: "Every page and feature works with none of these warnings or errors",
        },
      },
    ],
  },
];

// 進め方：工程ごとの、ツールと自分の分担
export const MIGRATION_STEPS: { name: Localized; tool: Localized; me: Localized }[] = [
  {
    name: { ja: "取得", en: "Fetch" },
    tool: {
      ja: "本番から読み取り専用で取得し、取得した時の状態を記録",
      en: "Pulls the site from production read-only and records its state at that moment",
    },
    me: { ja: "対象の範囲と、移行先の環境を確認する", en: "Confirm the scope and the target environment" },
  },
  {
    name: { ja: "診断", en: "Diagnose" },
    tool: {
      ja: "CMS・ライブラリの版の一覧と、静的解析で非互換の箇所を洗い出す",
      en: "Lists CMS and library versions, and finds incompatible code with static analysis",
    },
    me: {
      ja: "本体・プラグインを最新へ上げるか、直すか、止めるかを決める",
      en: "Decide whether to update, fix or disable the core and each plugin",
    },
  },
  {
    name: { ja: "実機確認", en: "Run" },
    tool: {
      ja: "PHP 8.4 の Docker でページを開き、エラーと表示を記録。フォーム送信・管理画面・cron も",
      en: "Opens pages in PHP 8.4 on Docker and records errors and rendering, including forms, the admin screens and cron",
    },
    me: { ja: "エラーの原因を読み、直す順番を決める", en: "Read the causes of the errors and decide the order of fixes" },
  },
  {
    name: { ja: "修正", en: "Fix" },
    tool: { ja: "機械的に直せる書き方はツールでまとめて直す", en: "Fixes mechanical patterns in bulk" },
    me: { ja: "残った箇所を Claude Code と対話しながら直す", en: "Fix what remains, working through it with Claude Code" },
  },
  {
    name: { ja: "比較", en: "Compare" },
    tool: {
      ja: "直す前と後のページを比べ、表示の変化を一覧にする",
      en: "Compares pages before and after the fixes and lists every visual change",
    },
    me: {
      ja: "崩れた箇所を見て、版を戻すか直すかを判断する",
      en: "Review the broken spots and decide whether to roll back a version or fix it",
    },
  },
  {
    name: { ja: "納品", en: "Deliver" },
    tool: {
      ja: "変えたファイルをまとめ、本番から変わっていないかを照合",
      en: "Packages the changed files and checks production has not changed in the meantime",
    },
    me: {
      ja: "お客様向け・技術者向けの診断レポートと、反映の手順を書く",
      en: "Write diagnostic reports for the client and for engineers, plus the deployment steps",
    },
  },
];

// 支援ツール（非公開）の数字と、使っている技術
export const MIGRATION_TOOL = {
  stats: [
    { label: { ja: "テスト", en: "Tests" }, value: "584", unit: { ja: "件", en: "" } },
    { label: { ja: "移行先の PHP", en: "Target PHP" }, value: "8.4" },
    { label: { ja: "検証用の MariaDB", en: "MariaDB for testing" }, value: "10.11" },
  ] as { label: Localized; value: string; unit?: Localized }[],
  stack: ["Python", "Docker", "phpcs / PHPCompatibility", "PHPStan", "Rector", "Claude Code", "pytest"],
};

// 移行で守っていること
export const MIGRATION_RULES: { title: Localized; body: Localized }[] = [
  {
    title: { ja: "本番には書き込まない", en: "Never write to production" },
    body: {
      ja: "取得は読み取り専用。直すのは手元の作業用のコピーだけで、すべて git で元に戻せます。",
      en: "Fetching is read-only. Fixes happen only on a local working copy, and every change can be undone with git.",
    },
  },
  {
    title: { ja: "移行先と同じ環境で、実際に開く", en: "Open every page in the target environment" },
    body: {
      ja: "静的解析は目安にとどめ、移行先と同じ PHP・DB の版の Docker でページを開いて、エラーと表示を確かめます。",
      en: "Static analysis is only a guide. Pages are opened on Docker with the same PHP and database versions as the target, to check errors and rendering.",
    },
  },
  {
    title: { ja: "まず最新へ、残ったものだけ直す", en: "Update first, then fix what remains" },
    body: {
      ja: "WordPress 本体やプラグインは、原因を1つずつ追う前に公式の最新版へ上げ、それでも残るエラーだけを直します。",
      en: "WordPress core and plugins are updated to their latest official releases before chasing individual errors, and only the errors that remain get fixed.",
    },
  },
  {
    title: { ja: "判断できる形で伝える", en: "Report in a form clients can decide on" },
    body: {
      ja: "レポートでは、プラグインやライブラリを1つずつ「更新」「停止」に分け、ファイル数と工数の目安を添えます。反映は、FTP と管理画面だけで行える手順書にまとめます。",
      en: "Reports sort each plugin and library into update or disable, with file counts and effort estimates. Deployment steps need nothing more than FTP and the admin screens.",
    },
  },
  {
    title: { ja: "メールは、届くところまで確かめる", en: "Check mail all the way to the inbox" },
    body: {
      ja: "フォームは送信できるかだけでなく、件名の文字化けや迷惑メールの判定まで、受信したメールで確かめます。",
      en: "Forms are checked beyond a successful submit: received mail is checked for garbled subjects and spam flags.",
    },
  },
];

// 対応してきたサイトの種類（社名・URL は出さない）
export const MIGRATION_CASES: { name: Localized; ver: Localized; body: Localized }[] = [
  {
    name: { ja: "本体が古い WordPress", en: "WordPress on a very old core" },
    ver: { ja: "WordPress 3.1〜4.9 → 7.1", en: "WordPress 3.1–4.9 → 7.1" },
    body: {
      ja: "配布の終わったプラグインは直接修正",
      en: "Discontinued plugins fixed by hand",
    },
  },
  {
    name: { ja: "WordPress のメールとフォーム", en: "WordPress mail and forms" },
    ver: { ja: "MW WP Form / Contact Form 7 ほか", en: "MW WP Form, Contact Form 7 and others" },
    body: {
      ja: "件名の文字化け・二重エンコードを修正",
      en: "Fixed garbled and double-encoded subjects",
    },
  },
  {
    name: { ja: "WordPress と同居する検索アプリ", en: "A search app beside WordPress" },
    ver: { ja: "Smarty 3.1 → 4.5", en: "Smarty 3.1 → 4.5" },
    body: {
      ja: "呼び出し側のコードも合わせて修正",
      en: "Calling code updated to match",
    },
  },
  {
    name: { ja: "EC-CUBE 2 系", en: "EC-CUBE 2" },
    ver: { ja: "EC-CUBE 2.13 → 2.25", en: "EC-CUBE 2.13 → 2.25" },
    body: {
      ja: "独自の改修を残したまま更新",
      en: "Upgraded with the customizations kept",
    },
  },
  {
    name: { ja: "Movable Type", en: "Movable Type" },
    ver: { ja: "MT 5.2 / 7.9", en: "MT 5.2 / 7.9" },
    body: {
      ja: "新しい DB で入れなくなった管理画面を復旧",
      en: "Restored admin logins broken by the new database",
    },
  },
  {
    name: { ja: "独自の PHP CMS", en: "A custom PHP CMS" },
    ver: { ja: "PHP 5 系の書き方 → 8.4", en: "PHP 5-era code → 8.4" },
    body: {
      ja: "`mysql_*` など PHP 8.4 で動かない書き方を修正",
      en: "Fixed `mysql_*` and other code PHP 8.4 rejects",
    },
  },
];

// 「記事の更新がサイトに届くまで」の3方式（文言は messages.ts の jam.lane.*）
export const LANES = ["SSG", "ISR", "SSR"] as const;

export const SAMPLE_QUESTIONS: Record<"ja" | "en", string[]> = {
  ja: ["得意なスキルを教えてください", "これまでの制作物を紹介してください", "このチャットはどんな仕組みですか？"],
  en: ["What are his main skills?", "Tell me about his projects.", "How does this chat work?"],
};

// ページ内の移動先（目次・⌘K パレット）。kan は見出しと縦書きナビの漢字、en は見出しの英語の小見出し、
// nav は英語表示のときのナビの文言、mark は ⌘K パレットの頭に付く1文字
export const SECTIONS = [
  { id: "skills", kan: "技能", en: "Skills", nav: "Skills", mark: "技" },
  { id: "migration", kan: "移行", en: "PHP 8.4 migration", nav: "Migration", mark: "移" },
  { id: "works", kan: "制作", en: "Selected works", nav: "Works", mark: "制" },
  { id: "jamstack", kan: "実装", en: "Jamstack", nav: "Jamstack", mark: "実" },
  { id: "blog", kan: "記録", en: "Blog", nav: "Blog", mark: "記" },
  { id: "arch", kan: "仕組", en: "How this site works", nav: "Architecture", mark: "仕" },
  { id: "contact", kan: "連絡", en: "Contact", nav: "Contact", mark: "連" },
] as const;
export type SectionId = (typeof SECTIONS)[number]["id"];

// reCAPTCHA v3 のサイトキー（公開して問題ない値）。空のときは reCAPTCHA を読み込まない。
// サーバー側には対になるシークレットキーを環境変数 RECAPTCHA_SECRET_KEY で設定する。
// 既定値は既存リポジトリと同じキー（reCAPTCHA の管理画面で、このサイトのドメインを追加しておくこと）。
// 別のキーを使うときは、ビルド時の環境変数 NEXT_PUBLIC_RECAPTCHA_SITE_KEY で上書きする（空なら既定値）
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeoiwUuAAAAABGP5A1GwYA98CffONhuEQZbAI7J";

// サーバー側の上限と揃える
export const MAX_INPUT_LENGTH = 500;
export const MAX_HISTORY = 10;
