/**
 * 一筆で引いた墨の線。.stroke の clip-path を左から開いて「描く」（CSS の @keyframes fude）。
 * ヒーローでは読み込み時に、セクション内では .sec.in になったときに描かれる。
 */
export default function Fude({ className = "" }: { className?: string }) {
  return (
    <svg className={`fude ${className}`.trim()} viewBox="0 0 1200 22" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="stroke" filter="url(#kasure)">
        <path d="M2,12 C60,6 160,7 300,9 C520,12 760,8 980,9 C1080,10 1150,11 1198,14 L1196,15 C1120,16 1040,15 940,15 C700,15 480,17 260,15 C150,14 70,16 4,17 C0,15 0,13 2,12 Z" />
      </g>
    </svg>
  );
}
