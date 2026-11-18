import type { CSSProperties } from "react";
import type { Lang } from "@/lib/messages";

/*
 * 制作欄の代表作に添える図。仕組み（Health-Insight-Agent）・比べ方（Defect-Hunter-Game）・数字（Budget-Tracker-App）を表す。
 * 図はデザイン案の SVG のまま。文字だけ表示言語に合わせ、書体は next/font の CSS 変数（--mono / --min）で指定する
 */
const MONO: CSSProperties = { fontFamily: "var(--mono)" };
const MIN: CSSProperties = { fontFamily: "var(--min)" };
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

const BUDGET: Labels<"tests" | "coverage" | "s0" | "s1" | "s2" | "s3"> = {
  ja: { tests: "tests — 単体・結合", coverage: "coverage", s0: "要件", s1: "設計", s2: "実装", s3: "テスト" },
  en: { tests: "tests — unit & integration", coverage: "coverage", s0: "Spec", s1: "Design", s2: "Build", s3: "Test" },
};

function BudgetArt({ lang }: { lang: Lang }) {
  const l = BUDGET[lang];
  const steps = [l.s0, l.s1, l.s2, l.s3];
  return (
    <svg viewBox="0 0 400 300" focusable="false">
      <g style={MIN} fill={INK}>
        <text x="28" y="112" fontSize="96" fontWeight="800" letterSpacing="-4">
          336
        </text>
        <text x="32" y="136" style={MONO} fontSize="12" fill={NEZUMI}>
          {l.tests}
        </text>
        <text x="372" y="262" textAnchor="end" fontSize="60" fontWeight="800" fill="none" stroke={INK} strokeWidth="1.3" letterSpacing="-2">
          99.9%
        </text>
        <text x="372" y="284" textAnchor="end" style={MONO} fontSize="12" fill={NEZUMI}>
          {l.coverage}
        </text>
        {/* カバレッジの棒（画面に入ると左から伸びる） */}
        <rect x="32" y="172" width="336" height="6" fill="rgba(29,29,27,.12)" />
        <rect className="cov" x="32" y="172" width="335.7" height="6" fill={SHU} />
        {steps.map((name, i) => (
          <text key={i} x={32 + i * 104} y="198" style={MONO} fontSize="10" fill={NEZUMI}>
            {name}
            {i < 3 ? "  →" : ""}
          </text>
        ))}
      </g>
    </svg>
  );
}

const ARTS: Record<string, (props: { lang: Lang }) => React.JSX.Element> = {
  "Python-Health-Insight-Agent": AgentArt,
  "Python-Defect-Hunter-Game": DefectArt,
  "Python-Budget-Tracker-App": BudgetArt,
};

export default function FeatureArt({ title, lang }: { title: string; lang: Lang }) {
  const Art = ARTS[title];
  return Art ? <Art lang={lang} /> : null;
}
