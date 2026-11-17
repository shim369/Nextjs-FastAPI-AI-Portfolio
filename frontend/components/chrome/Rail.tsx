"use client";

import { useEffect, useState } from "react";
import LogoMark from "@/components/svg/LogoMark";
import { SECTIONS } from "@/lib/config";
import { useI18n } from "@/lib/i18n";

/** 左の縦書きナビ：ロゴ・セクション名・読み進めた割合。スマホでは画面下のバーになる（CSS） */
export default function Rail() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // 読み進めた割合（％）
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.round(max > 0 ? (window.scrollY / max) * 100 : 0));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 今いるセクション（画面の中央の帯に入ったもの）
  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  return (
    <aside className="rail">
      <a className="mark" href="#top" aria-label={t("a11y.toTop")}>
        <LogoMark />
      </a>
      <nav aria-label={t("a11y.nav")}>
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? "on" : undefined}
            aria-current={active === s.id ? "location" : undefined}
            lang={lang}
          >
            {lang === "ja" ? s.kan : s.nav}
          </a>
        ))}
      </nav>
      <span className="prog" aria-hidden="true">
        {progress}%
      </span>
    </aside>
  );
}
