"use client";

import { Fragment, useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  MIGRATION_CASES,
  MIGRATION_RULES,
  MIGRATION_STEPS,
  MIGRATION_TOOL,
  MIGRATION_VERSIONS,
  type MigrationTag,
} from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { useInView } from "@/lib/motion";
import Section, { Reveal } from "./Section";

const LAST = MIGRATION_VERSIONS.length - 1;

/** 文中の `...` をコードとして表示する */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) => (i % 2 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

/**
 * 移行（PHP 8.4 移行支援）：見出しの一文、版の物差し（選んだ版で何が動かなくなるか）、
 * 工程ごとのツールとの分担、支援ツールの札と守っている決まり、対応してきたサイトの例。
 * 物差しは WAI-ARIA のタブ（左右の矢印キーで移動）。画面に入ると 5.4 から 8.4 へ墨の線が引かれる
 */
export default function Migration() {
  const { t, pick } = useI18n();
  const [index, setIndex] = useState(LAST);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const scale = useRef<HTMLDivElement>(null);
  const [rulerRef, rulerIn] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const ver = MIGRATION_VERSIONS[index];

  // 狭い画面では物差しが横にスクロールするので、最初は移行先（右端）を見せる
  useEffect(() => {
    const el = scale.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: index === LAST ? 0 : index + 1,
      ArrowLeft: index === 0 ? LAST : index - 1,
      Home: 0,
      End: LAST,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    setIndex(moves[e.key]);
    tabs.current[moves[e.key]]?.focus();
  };

  const tagLabel = (tag: MigrationTag) => (/^\d/.test(tag) ? tag : t(`mig.tag.${tag}`));

  return (
    <Section id="migration">
      <p className="mg-state">
        <span className="l">{t("mig.state1")}</span>
        <span className="l">{t("mig.state2")}</span>
      </p>
      <p className="mg-lead">{t("mig.lead")}</p>

      {/* 版の物差し：選んだ版で「何が動かなくなるか」 */}
      <Reveal>
        <div className={`ruler${rulerIn ? " on" : ""}`} ref={rulerRef}>
          <div className="r-top">
            <h3>{t("mig.ruler.title")}</h3>
            <p>{t("mig.ruler.hint")}</p>
          </div>
          <div className="r-scale" ref={scale}>
            <div className="r-line" aria-hidden="true">
              <span className="r-ink" />
            </div>
            <div className="r-vers" role="tablist" aria-label={t("mig.ruler.label")}>
              {MIGRATION_VERSIONS.map((v, i) => (
                <button
                  key={v.v}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`mig-tab-${i}`}
                  className={v.goal ? "goal" : undefined}
                  aria-selected={i === index}
                  aria-controls="mig-panel"
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => setIndex(i)}
                  onKeyDown={onKeyDown}
                >
                  <span className="v">{v.v}</span>
                  <span className="tick" aria-hidden="true" />
                  <span className="k">{v.note ? pick(v.note) : ""}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="r-panel" id="mig-panel" role="tabpanel" aria-labelledby={`mig-tab-${index}`} aria-live="polite">
            <h4 key={`h-${index}`} className="swap">
              PHP {ver.v}
              <small>{pick(ver.sub)}</small>
            </h4>
            <ul key={`u-${index}`} className="swap">
              {ver.items.map((item, i) => (
                <li key={i}>
                  <b className={item.tag === "removed" ? "x" : undefined}>{tagLabel(item.tag)}</b>
                  <span>
                    <Inline text={pick(item.text)} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* 進め方：工程ごとの、ツールと自分の分担 */}
      <div className="mg-flow-h">
        <h3>{t("mig.flow.title")}</h3>
      </div>
      <Reveal>
        <div className="mg-flow" role="group" aria-label={t("mig.flow.label")}>
          <div className="rh" aria-hidden="true">
            {t("mig.flow.step")}
          </div>
          <div className="rh tool-h" aria-hidden="true">
            {t("mig.flow.tool")}
          </div>
          <div className="rh me-h" aria-hidden="true">
            {t("mig.flow.me")}
          </div>
          {MIGRATION_STEPS.map((s, i) => (
            <Fragment key={i}>
              <div className="st">
                <i>{String(i + 1).padStart(2, "0")}</i>
                <b>{pick(s.name)}</b>
              </div>
              <p className="tool">
                <span className="who">{t("mig.flow.toolWho")}</span>
                {pick(s.tool)}
              </p>
              <p className="me">
                <span className="who">{t("mig.flow.meWho")}</span>
                {pick(s.me)}
              </p>
            </Fragment>
          ))}
        </div>
      </Reveal>
      <p className="mg-flow-note">{t("mig.flow.lead")}</p>

      {/* 支援ツール（非公開）と、守っている決まり */}
      <div className="tool-row">
        <Reveal as="article" className="mg-card">
          <span className="cat">
            {t("mig.tool.cat")}
            <b>{t("works.atWork")}</b>
          </span>
          <h3>{t("mig.tool.name")}</h3>
          <p>{t("mig.tool.body")}</p>
          <dl>
            {MIGRATION_TOOL.stats.map((s) => (
              <div key={s.value}>
                <dt>{pick(s.label)}</dt>
                <dd>
                  {s.value}
                  {s.unit && pick(s.unit) && <small>{pick(s.unit)}</small>}
                </dd>
              </div>
            ))}
          </dl>
          <ul className="stack">
            {MIGRATION_TOOL.stack.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p className="note">{t("mig.tool.private")}</p>
        </Reveal>

        <Reveal className="rules">
          <h3>{t("mig.rules.title")}</h3>
          <ul>
            {MIGRATION_RULES.map((r, i) => (
              <li key={i}>
                <b>{pick(r.title)}</b>
                <span>{pick(r.body)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* 対応してきたサイトの種類（社名は出さない） */}
      <Reveal className="cases">
        <h3>{t("mig.cases.title")}</h3>
        <ul>
          {MIGRATION_CASES.map((c, i) => (
            <li key={i}>
              <b>{pick(c.name)}</b>
              <em className="ver">{pick(c.ver)}</em>
              <span>
                <Inline text={pick(c.body)} />
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
