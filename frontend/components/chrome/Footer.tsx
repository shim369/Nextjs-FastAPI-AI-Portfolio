"use client";

import { GITHUB_URL } from "@/lib/config";
import { useI18n } from "@/lib/i18n";

/** フッター：名前を特大で、白抜き（Shinpei）と黒ベタ（Ohtani）で組む */
export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="foot">
      <div className="big" aria-hidden="true">
        Shinpei <span>Ohtani</span>
      </div>
      <div className="row">
        <span>{t("footer.role")}</span>
        <a href={GITHUB_URL} target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
    </footer>
  );
}
