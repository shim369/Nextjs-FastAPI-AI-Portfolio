import type { CSSProperties, Ref } from "react";

/*
 * ヒーローの絵：墨の梅の枝。幹から枝先へ一筆で伸び（.br）、朱の花が開く（.pts / .pt / .ctr）、
 * 最後につぼみ（.fl）がふくらむ。動きは styles/parts/_hero.scss の .ume。
 * 値はデザイン案（portfolio-a2-ume）の SVG のまま
 */

// 枝：[パス, 太さ, 描き始め(s), 描く時間(s)]。太い幹から順に、枝先ほど細く短く
const BRANCHES: [string, number, number, number][] = [
  ["M60 432 C80 382 96 352 130 322", 22, 0.2, 0.57],
  ["M130 322 L176 300 C200 290 214 268 222 240", 16, 0.77, 0.56],
  ["M222 240 C232 204 256 186 290 170", 11, 1.34, 0.44],
  ["M290 170 L318 128 C326 110 336 96 356 82", 6.5, 1.78, 0.48],
  ["M356 82 C366 74 374 64 382 48", 3, 2.26, 0.19],
  ["M176 300 C150 270 150 230 166 196", 8, 0.99, 0.48],
  ["M166 196 L150 160 C146 146 150 130 160 118", 4.5, 1.48, 0.37],
  ["M160 118 C164 104 172 96 184 88", 2, 1.84, 0.17],
  ["M290 170 C320 176 346 196 360 226", 6, 1.78, 0.4],
  ["M360 226 L386 250", 2.6, 2.18, 0.15],
  ["M222 240 C250 252 268 272 274 302", 4, 1.34, 0.37],
];

// 花：[開き始め(s), x, y, 回転(deg), 大きさ]
const BLOSSOMS: [number, number, number, number, number][] = [
  [1.43, 228, 232, 10, 1.18],
  [1.09, 182, 292, -20, 0.93],
  [1.88, 300, 160, 15, 0.96],
  [2.1, 326, 120, 0, 0.71],
  [2.33, 362, 80, 30, 0.62],
  [1.56, 160, 190, -10, 0.84],
  [1.84, 152, 128, 20, 0.65],
  [2.16, 352, 212, 0, 0.81],
  [1.73, 274, 298, 25, 0.65],
  [0.77, 120, 330, 5, 0.62],
];

// つぼみ：[ふくらみ始め(s), x, y, 半径]
const BUDS: [number, number, number, number][] = [
  [2.55, 386, 44, 3.8],
  [2.11, 188, 86, 3.4],
  [2.43, 388, 252, 3.2],
  [2.23, 338, 104, 3],
  [1.75, 268, 190, 3],
  [1.8, 278, 312, 3],
];

const SHU = "#c23a2b";
const KIN = "#d8b46a";
const PETAL_ANGLES = [0, 72, 144, 216, 288];

export default function UmeBranch({ caption, sceneRef }: { caption: string; sceneRef?: Ref<SVGSVGElement> }) {
  return (
    <figure className="byobu ume" aria-hidden="true">
      <svg className="scene" viewBox="0 0 400 440" ref={sceneRef} focusable="false">
        <defs>
          {/* 墨のにじみ（輪郭のゆらぎ）と、かすれ（筆の毛の筋） */}
          <filter id="ume-ink" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={3} result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale={4.5} result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.08" numOctaves={2} seed={11} result="k" />
            <feColorMatrix in="k" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 3.9" result="km" />
            <feComposite in="d" in2="km" operator="in" />
          </filter>
          {/* 幹の根元を紙に溶かす */}
          <linearGradient id="ume-fb" gradientUnits="userSpaceOnUse" x1="52" y1="440" x2="118" y2="336">
            <stop offset="0" stopColor="#000" />
            <stop offset=".25" stopColor="#555" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <mask id="ume-fade" maskUnits="userSpaceOnUse" x="-20" y="-20" width="440" height="480">
            <rect x="-20" y="-20" width="440" height="480" fill="url(#ume-fb)" />
          </mask>
        </defs>
        <g mask="url(#ume-fade)">
          <g filter="url(#ume-ink)" fill="none" stroke="#1d1d1b" strokeLinecap="round">
            {BRANCHES.map(([d, width, delay, duration]) => (
              <path
                key={d}
                className="br"
                pathLength={1}
                d={d}
                strokeWidth={width}
                style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
              />
            ))}
          </g>
        </g>
        {BLOSSOMS.map(([delay, x, y, rotate, scale]) => (
          <g
            key={`${x}-${y}`}
            className="bl"
            style={{ "--d": `${delay}s` } as CSSProperties}
            transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
          >
            <g className="pts" fill={SHU}>
              {PETAL_ANGLES.map((angle, i) => (
                <g key={angle} transform={`rotate(${angle})`}>
                  <circle className="pt" style={{ "--i": i } as CSSProperties} cy={-7} r={6.6} />
                </g>
              ))}
            </g>
            <circle className="ctr" r={2.6} fill={KIN} />
          </g>
        ))}
        {BUDS.map(([delay, cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} className="fl" style={{ animationDelay: `${delay}s` }} cx={cx} cy={cy} r={r} fill={SHU} />
        ))}
      </svg>
      <span className="tate" lang="ja">
        {caption}
      </span>
    </figure>
  );
}
