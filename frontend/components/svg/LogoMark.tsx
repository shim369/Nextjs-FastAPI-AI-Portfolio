/** ロゴマーク：朱の梅の花（五弁）。中心に白練の輪と金のしべ */
export default function LogoMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <g transform="translate(24 24.8) scale(1.45)">
        <g fill="#c23a2b">
          {[0, 72, 144, 216, 288].map((angle) => (
            <circle key={angle} cx="0" cy="-8.4" r="5.6" transform={`rotate(${angle})`} />
          ))}
        </g>
        <circle r="3.2" fill="#eeeeea" />
        <circle r="1.6" fill="#d8b46a" />
      </g>
    </svg>
  );
}
