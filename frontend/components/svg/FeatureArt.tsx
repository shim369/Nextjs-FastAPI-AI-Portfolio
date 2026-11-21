import type { CSSProperties } from "react";
import type { Lang } from "@/lib/messages";

/*
 * 制作欄の代表作に添える図。処理の流れ（Web-Analyzer）・仕組み（Health-Insight-Agent）・比べ方（Defect-Hunter-Game）を表す。
 * 図はデザイン案の SVG のまま。文字だけ表示言語に合わせ、書体は next/font の CSS 変数（--mono）で指定する
 */
const MONO: CSSProperties = { fontFamily: "var(--mono)" };
const INK = "#1d1d1b";
const PAPER = "#f7f7f4";
const SHU = "#c23a2b";
const NEZUMI = "#74736d";

type Labels<K extends string> = Record<Lang, Record<K, string>>;

const AGENT: Labels<"q" | "llm" | "answer" | "example" | "tool0" | "tool1" | "tool2"> = {
  ja: {
    q: "質問「睡眠と体重は？」",
    llm: "Gemini（説明）",
    answer: "回答＋根拠",
    example: "例）data: sleep_logs / n=90 / 相関係数",
    tool0: "統計ツール",
    tool1: "安全なSQL",
    tool2: "RAG（ノート）",
  },
  en: {
    q: "Q: sleep vs weight?",
    llm: "Gemini (explains)",
    answer: "Answer + evidence",
    example: "e.g. data: sleep_logs / n=90 / correlation",
    tool0: "Stats tool",
    tool1: "Safe SQL",
    tool2: "RAG (notes)",
  },
};

function AgentArt({ lang }: { lang: Lang }) {
  const l = AGENT[lang];
  const tools = [l.tool0, l.tool1, l.tool2];
  return (
    <svg viewBox="0 0 400 300" focusable="false">
      <g style={MONO} fontSize="11" fill={INK}>
        <rect x="24" y="30" width="150" height="40" fill={PAPER} stroke={INK} strokeWidth="1.2" />
        <text x="38" y="55">{l.q}</text>
        <rect x="226" y="30" width="150" height="40" fill={INK} />
        <text x="301" y="55" fill={PAPER} textAnchor="middle">
          {l.llm}
        </text>
        <path d="M174 50h52" stroke={INK} strokeWidth="1.2" />
        <path d="M220 46l6 4-6 4" fill="none" stroke={INK} strokeWidth="1.2" />
        {/* AI からツールへの呼び出し（朱の破線が流れる） */}
        <path className="flow" d="M301 70v40" stroke={SHU} strokeWidth="1.5" strokeDasharray="4 4" />
        {tools.map((name, i) => (
          <g key={i}>
            <rect x={24 + i * 126} y="112" width="114" height="44" fill={PAPER} stroke={INK} strokeWidth="1.2" />
            <text x={81 + i * 126} y="139" textAnchor="middle">
              {name}
            </text>
          </g>
        ))}
        <path d="M81 156v34M207 156v34M333 156v34M81 190h252" stroke={INK} strokeWidth="1.2" fill="none" />
        <rect x="24" y="214" width="352" height="58" fill={PAPER} stroke={SHU} strokeWidth="1.5" />
        <text x="40" y="238">{l.answer}</text>
        <text x="40" y="258" fill={NEZUMI}>
          {l.example}
        </text>
      </g>
    </svg>
  );
}

const DEFECT: Labels<"human" | "ai" | "iou"> = {
  ja: { human: "- - 人間", ai: "── AI (U-Net)", iou: "IoU で比較" },
  en: { human: "- - Human", ai: "── AI (U-Net)", iou: "Compared by IoU" },
};

function DefectArt({ lang }: { lang: Lang }) {
  const l = DEFECT[lang];
  return (
    <svg viewBox="0 0 400 300" focusable="false">
      <defs>
        <filter id="art-metal">
          <feTurbulence type="fractalNoise" baseFrequency=".9 .02" numOctaves={2} seed={5} />
          <feColorMatrix values="0 0 0 0 .55 0 0 0 0 .55 0 0 0 0 .53 0 0 0 .5 0" />
        </filter>
      </defs>
      {/* 金属の表面と、その上の傷 */}
      <rect width="400" height="300" fill="#b9b8b2" />
      <rect width="400" height="300" filter="url(#art-metal)" />
      <path d="M150 70 C 170 110 160 140 190 170 C 210 190 205 215 230 240" stroke="#3b3a36" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".75" />
      {/* 人間がなぞった線（破線）と、AI の予測（朱の線。画面に入ると描かれる） */}
      <path className="trace" d="M140 62 C 165 108 150 142 182 172 C 204 194 196 220 224 250" stroke={INK} strokeWidth="2" strokeDasharray="6 5" fill="none" />
      <path className="trace ai" d="M160 74 C 178 112 172 138 200 166 C 220 188 216 212 238 236" stroke={SHU} strokeWidth="2.4" fill="none" />
      <g style={MONO} fontSize="11">
        <rect x="20" y="20" width="96" height="24" fill={PAPER} />
        <text x="30" y="36" fill={INK}>
          {l.human}
        </text>
        <rect x="20" y="50" width="96" height="24" fill={PAPER} />
        <text x="30" y="66" fill={SHU}>
          {l.ai}
        </text>
        <rect x="268" y="252" width="112" height="28" fill={INK} />
        <text x="324" y="270" fill={PAPER} textAnchor="middle">
          {l.iou}
        </text>
      </g>
    </svg>
  );
}

const ANALYZER: Labels<"parallel" | "pages" | "rating" | "check" | "save"> = {
  ja: { parallel: "5 並列", pages: "頁", rating: "評価", check: "要確認", save: "SQLite (WAL) に1件ずつ保存 → 強制終了しても復旧" },
  en: { parallel: "5 parallel", pages: "Pg", rating: "Rate", check: "Check", save: "Saved one by one to SQLite (WAL) → survives a crash" },
};

// 入力（Excel のドメイン一覧）と、評価つきの結果の行。ドメインは架空の例
const DOMAINS = ["a-shoji.jp", "b-kensetsu.jp", "c-clinic.jp", "d-hotel.com", "e-school.jp"];
const RESULTS: [string, string, "x" | "check"][] = [
  ["WP", "48", "x"],
  ["—", "120+", "x"],
  ["—", "0", "check"],
  ["MT", "36+", "x"],
  ["EC", "82", "x"],
];
const ROW_LINES = "M254 80h124M254 106h124M254 132h124M254 158h124M254 184h124";

function AnalyzerArt({ lang }: { lang: Lang }) {
  const l = ANALYZER[lang];
  return (
    <svg viewBox="0 0 400 300" focusable="false">
      <g style={MONO} fontSize="10.5" fill={INK}>
        {/* 入力：Excel のドメイン一覧（B列） */}
        <rect x="22" y="26" width="128" height="190" fill={PAPER} stroke={INK} strokeWidth="1.2" />
        <rect x="22" y="26" width="128" height="26" fill={INK} />
        <text x="86" y="43" fill={PAPER} textAnchor="middle">
          domains.xlsx
        </text>
        <path d="M44 52v164" stroke="rgba(29,29,27,.18)" />
        <text x="30" y="72" fill={NEZUMI}>
          B
        </text>
        {DOMAINS.map((d, i) => (
          <text key={d} x="52" y={72 + i * 26}>
            {d}
          </text>
        ))}
        <text x="52" y="202" fill={NEZUMI}>
          …
        </text>
        <path d="M22 80h128M22 106h128M22 132h128M22 158h128M22 184h128" stroke="rgba(29,29,27,.12)" />

        {/* 並列クロール（5本。1本だけ朱の破線が流れる） */}
        <text x="203" y="40" textAnchor="middle" fill={NEZUMI}>
          {l.parallel}
        </text>
        <path d="M156 68h96M156 94h96M156 146h96M156 172h96" stroke={INK} strokeWidth="1.2" />
        <path className="flow" d="M156 120h96" stroke={SHU} strokeWidth="1.6" strokeDasharray="4 4" />
        <path d="M246 64l6 4-6 4M246 90l6 4-6 4M246 116l6 4-6 4M246 142l6 4-6 4M246 168l6 4-6 4" fill="none" stroke={INK} strokeWidth="1.2" />

        {/* 出力：評価つきの結果（画面に入ると1行ずつ確定していく）。列ごとに x をそろえる */}
        <rect x="254" y="26" width="124" height="190" fill={PAPER} stroke={INK} strokeWidth="1.2" />
        <g fill={NEZUMI}>
          <text x="264" y="44">CMS</text>
          <text x="298" y="44">{l.pages}</text>
          <text x="334" y="44">{l.rating}</text>
        </g>
        <path d="M254 52h124" stroke={INK} strokeWidth="1.2" />
        {RESULTS.map(([cms, pages, rating], i) => (
          <g key={i} className="row" style={{ animationDelay: `${0.2 + i * 0.4}s` }} fill={rating === "check" ? SHU : INK}>
            <text x="264" y={72 + i * 26}>{cms}</text>
            <text x="298" y={72 + i * 26}>{pages}</text>
            <text x="334" y={72 + i * 26}>{rating === "check" ? l.check : "×"}</text>
          </g>
        ))}
        <path d={ROW_LINES} stroke="rgba(29,29,27,.12)" />

        {/* 状態の保存 */}
        <rect x="22" y="236" width="356" height="40" fill={INK} />
        <text x="200" y="260" fill={PAPER} textAnchor="middle">
          {l.save}
        </text>
      </g>
    </svg>
  );
}

const ARTS: Record<string, (props: { lang: Lang }) => React.JSX.Element> = {
  "Python-Web-Analyzer": AnalyzerArt,
  "Python-Health-Insight-Agent": AgentArt,
  "Python-Defect-Hunter-Game": DefectArt,
};

export default function FeatureArt({ title, lang }: { title: string; lang: Lang }) {
  const Art = ARTS[title];
  return Art ? <Art lang={lang} /> : null;
}
