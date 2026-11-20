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
    category: { ja: "調査ツール", en: "Analysis tool" },
    summary: {
      ja: "Excelのドメイン一覧からSSL対応・CMS・ページ数を並列クロールで解析し、評価を付けるStreamlitアプリ。状態をSQLiteに保存し、強制終了後も復旧します。",
      en: "A Streamlit app that crawls a list of domains in parallel to detect SSL, CMS and page count, then rates each site. State is saved in SQLite.",
    },
    tech: ["Python", "Streamlit", "SQLite", "Playwright"],
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
    title: "Python-AI-Chat-Portfolio",
    category: { ja: "AI", en: "AI" },
    summary: {
      ja: "AIチャットの制作物。Gemini の function calling を使った手動エージェントループのAIチャットを、Vercel 上の FastAPI と Next.js で動かしています。このサイトのチャットの仕組みも、ここから引き継いでいます。",
      en: "An AI chat project: a hand-written agent loop with Gemini function calling, running on FastAPI and Next.js on Vercel. The chat on this site is built on the same foundation.",
    },
    tech: ["Python", "FastAPI", "Gemini API", "Next.js", "TypeScript"],
    url: "https://github.com/shim369/Python-AI-Chat-Portfolio",
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
    category: { ja: "業務アプリ", en: "Business app" },
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
export type Featured = { title: string; why: Localized; points: Localized[] };
export const FEATURED: Featured[] = [
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
  {
    title: "Python-Budget-Tracker-App",
    why: {
      ja: "詳細設計から結合テストまで、業務の開発工程を一人で通して練習するために作りました。機能より「設計どおりに作り、テストで確かめた」と言える状態を目標にしています。",
      en: "I built it to practise a full development process on my own, from detailed design to integration testing. The goal was less about features and more about being able to say it was built to the design and verified by tests.",
    },
    points: [
      {
        ja: "設計書と、要件からテストまでたどれるトレーサビリティを整備",
        en: "Design documents, with traceability from requirements through to tests",
      },
      { ja: "336件の単体・結合テストで、カバレッジ 99.9%", en: "336 unit and integration tests at 99.9% coverage" },
      {
        ja: "オフラインで動作し、日本語 / 英語の UI と CSV インポートに対応",
        en: "Works offline, with a Japanese / English UI and CSV import",
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
    name: { ja: "Web API・業務アプリ", en: "Web APIs & business apps" },
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
    name: "NEXT BASE", fw: "Next.js 16", render: "ISR", repo: "Nextjs-TypeScript-MicroCMS-Site2",
    demo: "https://next-tech-trigger.vercel.app", img: "nextjs-app", size: [1440, 637],
    tech: ["Next.js 16", "App Router", "Cache Components", "Server Actions", "microCMS"],
    note: {
      ja: "コーポレートサイト。記事は Cache Components（\"use cache\"）で1時間キャッシュし、microCMS の Webhook でキャッシュを作り直してすぐに反映。お問い合わせは Server Action で送信。",
      en: "A corporate site. Posts are cached for an hour with Cache Components (\"use cache\"), and a microCMS webhook rebuilds the cache so edits go live right away. The contact form is sent through a Server Action.",
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
