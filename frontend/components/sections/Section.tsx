"use client";

import type { ReactNode } from "react";
import { SECTIONS, type SectionId } from "@/lib/config";
import { useInView } from "@/lib/motion";

/**
 * セクションの枠。左に縦書きの見出し（漢字）と英語の小見出しを置く。
 * 初めて画面に入ったら .in を付け、見出し・筆の線・罫線などの演出を一度だけ動かす（CSS）
 */
export default function Section({ id, children, className = "" }: { id: SectionId; children: ReactNode; className?: string }) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12 });
  const meta = SECTIONS.find((s) => s.id === id)!;
  const headingId = `${id}-heading`;
  return (
    <section ref={ref} id={id} className={`sec ${className}${inView ? " in" : ""}`} aria-labelledby={headingId}>
      <header className="sec-h">
        <div className="stick">
          <h2 id={headingId} lang="ja">
            {meta.kan}
          </h2>
          <p lang="en">{meta.en}</p>
        </div>
      </header>
      <div className="sec-b">{children}</div>
    </section>
  );
}

/** 画面に入ったらふわっと出す要素（[data-reveal]） */
export function Reveal({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" }) {
  const [ref, inView] = useInView<HTMLDivElement & HTMLUListElement>({ rootMargin: "0px 0px -12% 0px" });
  return (
    <Tag ref={ref} className={`${className ?? ""}${inView ? " in" : ""}`.trim() || undefined} data-reveal="">
      {children}
    </Tag>
  );
}
