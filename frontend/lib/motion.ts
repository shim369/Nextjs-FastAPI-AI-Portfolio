"use client";

import { useEffect, useRef, useState } from "react";

/** 「動きを減らす」設定かどうか（サーバー側では false） */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type InViewOptions = { threshold?: number; rootMargin?: string };

/**
 * 要素が初めて画面に入ったら true になる（一度だけ。以後は監視しない）。
 * 動きを減らす設定のときは、最初から描き終わった状態にするため、すぐ true にする。
 */
export function useInView<T extends Element>({ threshold = 0, rootMargin = "0px" }: InViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      // 監視せずに描き終わった状態を出す（外部の状態＝OS の設定に合わせる）
      queueMicrotask(() => setInView(true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView] as const;
}
