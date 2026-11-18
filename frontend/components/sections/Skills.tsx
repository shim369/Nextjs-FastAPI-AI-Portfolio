"use client";

import { useState } from "react";
import { DOMAINS, PROJECTS, PYTHON_LIBRARIES, SHORT_SKILL_NAMES, SKILLS, projectsInDomain, type Domain } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import DomainModal from "./DomainModal";
import Section, { Reveal } from "./Section";

const PYTHON = SKILLS.find((s) => s.name === "Python")!;
const FOUNDATIONS = SKILLS.filter((s) => s !== PYTHON);
// 関連ライブラリは、Python の制作物で実際に使っているもの（と、個人開発で使っている Django）だけを並べる
const USED = new Set(PROJECTS.filter((p) => p.tech[0] === "Python").flatMap((p) => p.tech).concat("Django"));
const KEYWORDS = PYTHON_LIBRARIES.filter((k) => USED.has(k));

/**
 * 技能：Python を大きなパネルで主役にする。右側は「Python でできること」（領域ごとの制作物の件数。押すとモーダルで一覧）。
 * ほかは「土台にある技術」として4列で並べる（経験年数のグラフは使わない）
 */
export default function Skills() {
  const { t, pick } = useI18n();
  const [domain, setDomain] = useState<Domain | null>(null);

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
          <p>{pick(PYTHON.note)}</p>
          <ul className="kw">
            {KEYWORDS.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
        <div className="f-r">
          <h4>{t("skills.focus.domains")}</h4>
          <ol className="doms">
            {DOMAINS.map((d) => {
              const n = projectsInDomain(d).length;
              const name = pick(d.name);
              return (
                <li key={d.id}>
                  <button type="button" aria-haspopup="dialog" aria-label={t("skills.dom.open", { name, n })} onClick={() => setDomain(d)}>
                    <span className="d-t">
                      <b>{name}</b>
                      <small>{pick(d.desc)}</small>
                    </span>
                    <span className="d-n">
                      <em>{n}</em>
                      {t("skills.dom.unit")}
                      <i className="d-open" aria-hidden="true">
                        ＋
                      </i>
                    </span>
                  </button>
                </li>
              );
            })}
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
            <b title={SHORT_SKILL_NAMES[s.name] ? s.name : undefined}>{SHORT_SKILL_NAMES[s.name] ?? s.name}</b>
            <span>{pick(s.years)}</span>
            <p>{pick(s.note)}</p>
          </li>
        ))}
      </ul>
      <p className="extra">{t("skills.extra")}</p>
      <DomainModal domain={domain} onClose={() => setDomain(null)} />
    </Section>
  );
}
