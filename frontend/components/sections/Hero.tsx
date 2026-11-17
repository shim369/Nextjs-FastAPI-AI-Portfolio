"use client";

import { useState, type FormEvent } from "react";
import Fude from "@/components/svg/Fude";
import Kasumi from "@/components/svg/Kasumi";
import { MAX_INPUT_LENGTH, SAMPLE_QUESTIONS } from "@/lib/config";
import { useChatUI } from "@/lib/chat-ui";
import { useI18n } from "@/lib/i18n";

/** ヒーロー：名前を大きく組み、縦書きのキャッチ・筆の線・AIへの質問バーを置く */
export default function Hero() {
  const { t, lang } = useI18n();
  const { ask } = useChatUI();
  const [draft, setDraft] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    ask(draft);
    setDraft("");
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <Kasumi />
      <div className="h-top">
        <span>{t("hero.top.left")}</span>
        <span>{t("hero.top.right")}</span>
      </div>
      <div className="h-main">
        <h1 className="h-name" id="hero-name" aria-label="Shinpei Ohtani">
          <span className="l" aria-hidden="true">
            <span>Shinpei</span>
          </span>
          <span className="l" aria-hidden="true">
            <span className="o">Ohtani</span>
            <span className="dot">.</span>
          </span>
        </h1>
        <p className="h-catch" lang={lang}>
          <span>{t("hero.catch1")}</span>
          <span>{t("hero.catch2")}</span>
        </p>
      </div>
      <Fude />
      <div className="h-ask">
        <p className="lead">{t("hero.lead")}</p>
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
    </section>
  );
}
