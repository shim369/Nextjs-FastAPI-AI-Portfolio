/** 1本の霞を、少しずつずらした丸い帯の重なりで描く。steps は [x のずれ, y のずれ, 幅の増減] */
type Step = [dx: number, dy: number, dw: number];
type Band = { fill: string; opacity: number; x: number; y: number; w: number; h: number; steps: Step[] };

// 5本。CSS 側で、同じ速さ・等間隔（320s を5等分した遅れ）で右へ流す
const BANDS: Band[] = [
  { fill: "#1d1d1b", opacity: 0.05, x: 0, y: 70, w: 520, h: 32, steps: [[0, 0, 0], [70, 26, -140], [-60, 52, -80]] },
  { fill: "#1d1d1b", opacity: 0.04, x: 0, y: 470, w: 460, h: 28, steps: [[0, 0, 0], [90, 24, -180]] },
  { fill: "#c23a2b", opacity: 0.065, x: 0, y: 330, w: 380, h: 24, steps: [[0, 0, 0], [60, 22, -150]] },
  { fill: "#1d1d1b", opacity: 0.045, x: 0, y: 590, w: 540, h: 30, steps: [[0, 0, 0], [-50, -26, -120], [80, 26, -220]] },
  { fill: "#1d1d1b", opacity: 0.04, x: 0, y: 200, w: 440, h: 28, steps: [[0, 0, 0], [80, 26, -160]] },
];

/** すやり霞：屏風絵の霞が、ゆっくり横に流れる（ヒーローの背景） */
export default function Kasumi() {
  return (
    <svg className="kasumi" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {BANDS.map((b, i) => (
        <g key={i} fill={b.fill} opacity={b.opacity}>
          {b.steps.map(([dx, dy, dw], j) => (
            <rect key={j} x={b.x + dx} y={b.y + dy} width={b.w + dw} height={b.h} rx={b.h / 2} />
          ))}
        </g>
      ))}
    </svg>
  );
}
