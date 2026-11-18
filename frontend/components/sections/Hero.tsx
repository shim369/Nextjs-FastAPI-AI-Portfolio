"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import UmeBranch from "@/components/svg/UmeBranch";
import { MAX_INPUT_LENGTH, SAMPLE_QUESTIONS } from "@/lib/config";
import { useChatUI } from "@/lib/chat-ui";
import { useI18n } from "@/lib/i18n";
import { prefersReducedMotion } from "@/lib/motion";

const FOOT = [1, 2, 3] as const;
// 絵の縦書きの添え書き（装飾なので言語は切り替えない）
const UME_CAPTION = "古い枝に、新しい花を。";

/** ヒーロー：署名・見出し・AIへの質問バーと、墨の梅の枝の絵。下端に「できること」3つの帯 */
export default function Hero() {
  const { t, lang } = useI18n();
  const { ask } = useChatUI();
  const [draft, setDraft] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);

  // マウスに合わせて絵をわずかにずらす（マウス操作の環境で、動きを減らす設定がないときだけ）
  useEffect(() => {
    const hero = heroRef.current;
    const scene = sceneRef.current;
    if (!hero || !scene || !window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const onMove = (e: PointerEvent) => {
      const r = scene.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      scene.style.transform = `translate(${x * 8}px, ${y * 5}px)`;
    };
    hero.addEventListener("pointermove", onMove);
    return () => hero.removeEventListener("pointermove", onMove);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    ask(draft);
    setDraft("");
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-name" ref={heroRef}>
      <div className="h-main">
        <div className="h-copy">
          <h1 className="h-sig" id="hero-name">
            <b>Shinpei Ohtani</b>
            <span>{t("bar.role")}</span>
          </h1>
          <p className="h-state" lang={lang}>
            <span className="l">
              <span>{t("hero.catch1")}</span>
            </span>
            <span className="l">
              <span>
                {t("hero.catch2")}
                <span className="dot">{t("hero.catch.dot")}</span>
              </span>
            </span>
          </p>
          <p className="lead">{t("hero.lead")}</p>
          <div className="h-ask">
            <div className="askbar">
              <form onSubmit={onSubmit} role="search" aria-label={t("hero.ask.label")}>
                <b aria-hidden="true">{t("hero.ask.mark")}</b>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={t("hero.ask.placeholder")}
                  aria-label={t("hero.ask.label")}
                  maxLength={MAX_INPUT_LENGTH}
                  enterKeyHint="send"
                />
                <button type="submit">{t("hero.ask.submit")}</button>
              </form>
              <div className="chips" role="group" aria-label={t("hero.chips")}>
                {SAMPLE_QUESTIONS[lang].map((q) => (
                  <button key={q} type="button" onClick={() => ask(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <UmeBranch caption={UME_CAPTION} sceneRef={sceneRef} />
      </div>
      <div className="h-foot" role="list" aria-label={t("hero.foot.label")}>
        {FOOT.map((n) => (
          <div key={n} role="listitem">
            <b>{t(`hero.foot.${n}.title`)}</b>
            <small>{t(`hero.foot.${n}.body`)}</small>
          </div>
        ))}
        <span className="scroll" aria-hidden="true">
          <i />
          {t("hero.scroll")}
        </span>
      </div>
    </section>
  );
}
