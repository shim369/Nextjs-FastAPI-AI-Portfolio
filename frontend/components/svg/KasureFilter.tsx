/** 筆の線（Fude）の縁をかすれさせるフィルター。ページに1つだけ置く */
export default function KasureFilter() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="kasure" x="-2%" y="-60%" width="104%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5 0.04" numOctaves={2} seed={3} />
          <feDisplacementMap in="SourceGraphic" scale={2.2} />
        </filter>
      </defs>
    </svg>
  );
}
