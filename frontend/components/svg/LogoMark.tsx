/** ロゴマーク：細い円の中に、朱の日の出と墨の霞2本 */
export default function LogoMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="logo-clip">
          <circle cx="24" cy="24" r="21.5" />
        </clipPath>
      </defs>
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <g clipPath="url(#logo-clip)">
        <circle cx="27" cy="23" r="9" fill="#c23a2b" />
        <rect x="-4" y="25.5" width="36" height="5" rx="2.5" fill="#eeeeea" />
        <rect x="-4" y="26.5" width="34" height="3" rx="1.5" />
        <rect x="16" y="33" width="40" height="5" rx="2.5" fill="#eeeeea" />
        <rect x="18" y="34" width="38" height="3" rx="1.5" />
      </g>
    </svg>
  );
}
