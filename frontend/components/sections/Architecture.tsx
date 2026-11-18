"use client";

import { useI18n } from "@/lib/i18n";
import Section, { Reveal } from "./Section";

const NOTES = ["arch.note1", "arch.note2", "arch.note3"] as const;

/** 仕組：構成図（Browser → Vercel → FastAPI → Gemini API）に朱の線が流れ、その下に設計メモ3点 */
export default function Architecture() {
  const { t } = useI18n();
  return (
    <Section id="arch">
      <div className="flow" role="group" aria-label={t("arch.label")}>
        <div>
          <b>Browser</b>
          <small>{t("arch.browser")}</small>
        </div>
        <div>
          <b>Vercel</b>
          <small>{t("arch.vercel")}</small>
        </div>
        <div className="ai">
          <b>FastAPI</b>
          <small>{t("arch.fastapi")}</small>
        </div>
        <div>
          <b>Gemini API</b>
          <small>{t("arch.gemini")}</small>
        </div>
        <span className="pulse" aria-hidden="true">
          <i />
        </span>
      </div>
      <div className="notes">
        {NOTES.map((key) => (
          <Reveal key={key}>
            <h3>{t(`${key}.title`)}</h3>
            <p>{t(`${key}.body`)}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
