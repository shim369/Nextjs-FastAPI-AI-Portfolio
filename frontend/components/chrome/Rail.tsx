"use client";

import { useEffect, useRef, useState } from "react";
import LogoMark from "@/components/svg/LogoMark";
import { SECTIONS } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { prefersReducedMotion } from "@/lib/motion";

/** 左の縦書きナビ：ロゴ・セクション名・読み進めた割合。スマホでは画面下のバーになる（CSS） */
export default function Rail() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);

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

  // スマホの下のバー：横にはみ出す側の端をぼかす印を付ける（CSS の data-more-l / data-more-r）
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const update = () => {
      const max = nav.scrollWidth - nav.clientWidth;
      nav.toggleAttribute("data-more-l", max > 1 && nav.scrollLeft > 1);
      nav.toggleAttribute("data-more-r", max > 1 && nav.scrollLeft < max - 1);
    };
    update();
    nav.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    return () => {
      nav.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [lang]);

  // 今いるセクションの項目が、横にスクロールするバーの中央に来るようにする（縦書きのときははみ出さないので動かない）
  useEffect(() => {
    const nav = navRef.current;
    const link = active ? nav?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [active, lang]);

  return (
    <aside className="rail">
      <a className="mark" href="#top" aria-label={t("a11y.toTop")}>
        <LogoMark />
      </a>
      <nav aria-label={t("a11y.nav")} ref={navRef}>
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
