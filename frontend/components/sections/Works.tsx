"use client";

import FeatureArt from "@/components/svg/FeatureArt";
import { FEATURED, GITHUB_URL, PROJECTS, type Project } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import Section, { Reveal } from "./Section";

const byTitle = (title: string) => PROJECTS.find((p) => p.title === title)!;
const OTHERS = PROJECTS.filter((p) => !FEATURED.some((f) => f.title === p.title));

function Links({ project: p }: { project: Project }) {
  const { t } = useI18n();
  return (
    <div className="links">
      <a href={p.url} target="_blank" rel="noopener" aria-label={`${p.title} — GitHub`}>
        GitHub
      </a>
      {p.demo && (
        <a href={p.demo} target="_blank" rel="noopener" aria-label={`${p.title} — ${t("works.demo")}`}>
          {t("works.demo")}
        </a>
      )}
    </div>
  );
}

/**
 * 制作：特に力を入れた3つを、仕組みを表す図・作った理由・工夫した点とあわせて紹介する（図は左右交互）。
 * その下に、その他の制作物の一覧
 */
export default function Works() {
  const { t, pick, lang } = useI18n();
  return (
    <Section id="works">
      <p className="ft-lead">{t("works.lead")}</p>
      <div className="feats">
        {FEATURED.map((f, i) => {
          const p = byTitle(f.title);
          return (
            <Reveal key={f.title} as="article" className={`ft${i % 2 ? " rev" : ""}`}>
              <figure className="ft-fig" aria-hidden="true">
                <FeatureArt title={f.title} lang={lang} />
              </figure>
              <div className="ft-txt">
                <span className="cat">
                  {pick(p.category)}
                  {f.atWork && <b>{t("works.atWork")}</b>}
                </span>
                <h3>{p.title.replace(/^Python-/, "")}</h3>
                <p className="why">{pick(f.why)}</p>
                <ol className="pts">
                  {f.points.map((point, j) => (
                    <li key={j}>{pick(point)}</li>
                  ))}
                </ol>
                <ul className="tags">
                  {p.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <Links project={p} />
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="others">
        <h3>{t("works.others")}</h3>
        <ul>
          {OTHERS.map((p) => (
            <li key={p.title}>
              <a href={p.url} target="_blank" rel="noopener">
                <b>{p.title}</b>
                <small>{pick(p.category)}</small>
              </a>
            </li>
          ))}
        </ul>
        <a className="btn-line" href={`${GITHUB_URL}?tab=repositories`} target="_blank" rel="noopener">
          {t("works.allRepos")}
        </a>
      </div>
    </Section>
  );
}
