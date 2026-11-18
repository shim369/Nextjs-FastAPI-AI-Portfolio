"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projectsInDomain, type Domain } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { prefersReducedMotion } from "@/lib/motion";

// 閉じるアニメーション（styles/parts/_skills.scss の dm-out）の長さ
const CLOSE_MS = 280;

/**
 * 「Python でできること」の領域のモーダル。その領域に当てはまる制作物を一覧し、当てはまった技術タグを墨で塗る。
 * <dialog> の showModal で開くので、フォーカスの閉じ込めと、閉じたあと開いたボタンへのフォーカスの戻りはブラウザが行う
 */
export default function DomainModal({ domain, onClose }: { domain: Domain | null; onClose: () => void }) {
  const { t, pick } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg || !domain) return;
    if (!dlg.open) dlg.showModal();
    document.body.classList.add("modal-open");
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [domain]);

  const close = () => {
    const dlg = ref.current;
    if (!dlg?.open || closing) return;
    setClosing(true);
    window.setTimeout(
      () => {
        dlg.close();
        setClosing(false);
      },
      prefersReducedMotion() ? 0 : CLOSE_MS
    );
  };

  // 親の domain は、閉じるアニメーションが終わって onClose が呼ばれるまで残る
  const shown = domain;
  const list = shown ? projectsInDomain(shown) : [];

  return (
    <dialog
      id="dom-modal"
      ref={ref}
      className={closing ? "closing" : undefined}
      aria-labelledby="dm-title"
      // Esc：すぐには閉じず、閉じるアニメーションを見せてから閉じる
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClose={() => {
        document.body.classList.remove("modal-open");
        onClose();
      }}
      // 幕（dialog の外側）をクリックしたら閉じる
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {shown && (
        <>
          <div className="dm-top">
            <div className="dm-head">
              <span className="dm-tag">
                <i aria-hidden="true" />
                {t("dm.tag")}
              </span>
              <h2 id="dm-title">{pick(shown.name)}</h2>
              <p>{pick(shown.desc)}</p>
            </div>
            <button className="dm-close" type="button" onClick={close} aria-label={t("dm.close")}>
              ×
            </button>
          </div>
          <div className="dm-count">
            <em>{list.length}</em>
            {t("dm.count")}
          </div>
          <div className="dm-body" ref={bodyRef}>
            <ol className="dm-list">
              {list.map((p, i) => (
                <li key={p.title} style={{ "--i": i } as CSSProperties}>
                  <span className="cat">{pick(p.category)}</span>
                  <h3>{p.title}</h3>
                  <p>{pick(p.summary)}</p>
                  <ul className="tags">
                    {p.tech.map((tech) => (
                      <li key={tech} className={shown.match.includes(tech) ? "on" : undefined}>
                        {tech}
                      </li>
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
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </dialog>
  );
}
