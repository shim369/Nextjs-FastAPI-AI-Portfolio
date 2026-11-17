"use client";

import Fude from "@/components/svg/Fude";
import { PROJECTS, PYTHON_LIBRARIES, SKILLS } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import Section, { Reveal } from "./Section";

const PYTHON = SKILLS.find((s) => s.name === "Python")!;
const FOUNDATIONS = SKILLS.filter((s) => s !== PYTHON);
// Python が主役の制作物（使用技術の先頭が Python のもの）
const PYTHON_WORKS = PROJECTS.filter((p) => p.tech[0] === "Python");
// 関連ライブラリは、Python の制作物で実際に使っているもの（と、個人開発で使っている Django）だけを並べる
const USED = new Set(PYTHON_WORKS.flatMap((p) => p.tech).concat("Django"));
const KEYWORDS = PYTHON_LIBRARIES.filter((k) => USED.has(k));

/** 技能：Python を大きなパネルで主役にし、ほかは「土台にある技術」として4列で並べる（経験年数のグラフは使わない） */
export default function Skills() {
  const { t, pick } = useI18n();
  return (
    <Section id="skills">
      <Reveal className="focus">
        <div className="f-l">
          <span className="f-tag">
            <i aria-hidden="true" />
            {t("skills.focus.tag")}
          </span>
          <h3>
            Py<span>thon</span>
          </h3>
          <Fude />
          <p>{pick(PYTHON.note)}</p>
          <ul className="kw">
            {KEYWORDS.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
        <div className="f-r">
          <h4>{t("skills.focus.made")}</h4>
          <ol>
            {PYTHON_WORKS.map((p) => (
              <li key={p.title}>
                <a href={p.url} target="_blank" rel="noopener">
                  <b>{p.title.replace(/^Python-/, "")}</b>
                  <small>{pick(p.category)}</small>
                </a>
              </li>
            ))}
          </ol>
          <a className="go" href="#works">
            <span>{t("skills.focus.go")}</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </Reveal>
      <div className="base-h">
        <h3>{t("skills.base.title")}</h3>
        <p>{t("skills.base.lead")}</p>
      </div>
      <ul className="base">
        {FOUNDATIONS.map((s) => (
          <li key={s.name}>
            <b>{s.name}</b>
            <span>{pick(s.years)}</span>
            <p>{pick(s.note)}</p>
          </li>
        ))}
      </ul>
      <p className="extra">{t("skills.extra")}</p>
    </Section>
  );
}
