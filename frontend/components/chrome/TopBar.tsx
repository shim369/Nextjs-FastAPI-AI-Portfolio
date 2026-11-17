"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/messages";
import { usePalette } from "@/lib/palette";

const TOKYO_TIME = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** 東京の現在時刻（秒まで）。サーバーでは「--:--:--」を出し、表示後に動かす */
function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(TOKYO_TIME.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="clock">
      <time suppressHydrationWarning>Tokyo {now ?? "--:--:--"}</time>
    </span>
  );
}

// ⌘K / Ctrl K の表記は端末で変える（サーバーでは出さない）
const subscribeNoop = () => () => {};
const shortcutLabel = () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K");

/** 上の柱：名前・職種・東京の時刻・言語・「AIに聞く・移動」 */
export default function TopBar() {
  const { t, lang, setLang } = useI18n();
  const { open } = usePalette();
  const kbd = useSyncExternalStore(subscribeNoop, shortcutLabel, () => "");

  const langButton = (code: Lang, label: string) => (
    <button type="button" lang={code} aria-pressed={lang === code} onClick={() => setLang(code)}>
      {label}
    </button>
  );

  return (
    <div className="bar">
      <span>
        <b>Shinpei Ohtani</b>
        <span className="pf">&nbsp;{t("bar.portfolio")}</span>
      </span>
      <span>{t("bar.role")}</span>
      <Clock />
      <span className="lang" role="group" aria-label={t("lang.label")}>
        {langButton("ja", "JA")}
        <span aria-hidden="true">/</span>
        {langButton("en", "EN")}
      </span>
      <button className="cmd" type="button" onClick={open} aria-haspopup="dialog" aria-keyshortcuts="Meta+K Control+K">
        {t("bar.cmd")} <kbd>{kbd}</kbd>
      </button>
    </div>
  );
}
