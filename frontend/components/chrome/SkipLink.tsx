"use client";

import { useI18n } from "@/lib/i18n";

export default function SkipLink() {
  const { t } = useI18n();
  return (
    <a className="skip" href="#main">
      {t("a11y.skip")}
    </a>
  );
}
