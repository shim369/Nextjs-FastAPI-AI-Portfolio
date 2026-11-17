"use client";

import type { CSSProperties } from "react";
import { GITHUB_URL, PROJECTS } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import Section from "./Section";

/**
 * 制作：目録風の一覧。ホバーかフォーカスで行が開き、概要・技術タグ・リンクを出す。
 * スマホ（タッチ端末・760px 以下）では最初から開いている（CSS）。罫線は .in で上の行から順に引かれる
 */
export default function Works() {
  const { t, pick } = useI18n();
  return (
    <Section id="works">
      <div className="works">
        {PROJECTS.map((p, i) => (
          // 行全体にフォーカスできるようにし、キーボードでも開けるようにする（中のリンクにも Tab で進める）
          <article key={p.title} className="wk" tabIndex={0} style={{ "--i": i } as CSSProperties} aria-labelledby={`wk-${i}`}>
            <div className="head">
              <span className="cat">{pick(p.category)}</span>
              <h3 id={`wk-${i}`}>{p.title}</h3>
              <span className="go">{p.tech.slice(0, 2).join(" / ")}</span>
            </div>
            <div className="body">
              <div>
                <p>{pick(p.summary)}</p>
                <div className="r">
                  <ul className="tags">
                    {p.tech.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
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
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="more">
        <a className="btn-line" href={`${GITHUB_URL}?tab=repositories`} target="_blank" rel="noopener">
          {t("works.more")}
        </a>
      </p>
    </Section>
  );
}
