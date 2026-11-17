"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { GITHUB_URL, JAMSTACK, LANES } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { prefersReducedMotion } from "@/lib/motion";
import Section, { Reveal } from "./Section";

/**
 * 実装（Jamstack）：黒漆の帯。左のリストでサイトを選ぶと、右のスクリーンショットが View Transition で切り替わり、
 * 「記事の更新がサイトに届くまで」のうち当てはまる方式が光る。リストは WAI-ARIA のタブ（矢印キーで移動）
 */
export default function Jamstack() {
  const { t, pick } = useI18n();
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const site = JAMSTACK[index];

  const select = (next: number) => {
    if (next === index) return;
    const update = () => flushSync(() => setIndex(next));
    if (typeof document.startViewTransition === "function" && !prefersReducedMotion()) {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = JAMSTACK.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowRight: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const next = moves[e.key];
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section id="jamstack" className="urushi">
      <p className="jam-lead">{t("jam.lead")}</p>
      <Reveal className="jam">
        <div className="jam-list" role="tablist" aria-label={t("jam.list")} aria-orientation="vertical">
          {JAMSTACK.map((j, i) => (
            <button
              key={j.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`jam-tab-${i}`}
              aria-selected={i === index}
              aria-controls="jam-view"
              tabIndex={i === index ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={onKeyDown}
            >
              <b>{j.name}</b>
              <small>{j.fw}</small>
              <em>{j.render}</em>
            </button>
          ))}
        </div>
        <div className="jam-view" id="jam-view" role="tabpanel" aria-labelledby={`jam-tab-${index}`}>
          <div className="jam-shot">
            <Image
              key={site.img}
              src={`/images/jamstack/${site.img}.webp`}
              alt={t("jam.shotAlt", { name: site.name })}
              width={site.size[0]}
              height={site.size[1]}
              sizes="(max-width: 1000px) 100vw, 60vw"
            />
            <a className="open" href={site.demo} target="_blank" rel="noopener">
              {t("jam.open")}
            </a>
          </div>
          <div className="jam-info">
            <div>
              <h3>{site.name}</h3>
              <span className="fw">{site.fw} × microCMS</span>
              <p>{pick(site.note)}</p>
              <ul className="tags">
                {site.tech.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <div className="links" style={{ marginTop: 16 }}>
                <a href={site.demo} target="_blank" rel="noopener">
                  {t("jam.demo")}
                </a>
                <a href={`${GITHUB_URL}/${site.repo}`} target="_blank" rel="noopener">
                  GitHub
                </a>
              </div>
            </div>
            <div className="lanes">
              <h4>{t("jam.lanes")}</h4>
              {LANES.map((lane) => {
                const on = site.render.includes(lane);
                return (
                  <div key={lane} className={`lane${on ? " on" : ""}`}>
                    <b>{lane}</b>
                    <span>
                      {t(`jam.lane.${lane}`)}
                      {on && <span className="sr">{t("jam.lane.on")}</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
