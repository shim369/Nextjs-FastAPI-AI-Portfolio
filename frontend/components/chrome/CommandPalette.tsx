"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { SAMPLE_QUESTIONS, SECTIONS } from "@/lib/config";
import { useChatUI } from "@/lib/chat-ui";
import { useI18n } from "@/lib/i18n";
import { prefersReducedMotion } from "@/lib/motion";
import { usePalette } from "@/lib/palette";

type Item = { mark: string; label: string; kind: string } & ({ ai: string } | { href: string });

/**
 * ⌘K パレット：1つの入力欄で、AIへの質問とページ内の移動の両方ができる。
 * 入力欄は combobox、候補は listbox。↑↓で選び Enter で実行、Esc で閉じる（<dialog> が開く前の場所へフォーカスを戻す）
 */
export default function CommandPalette() {
  const { t, lang } = useI18n();
  const { isOpen, close } = usePalette();
  const { ask } = useChatUI();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const items = useMemo<Item[]>(() => {
    const q = query.trim();
    const asks: Item[] = q
      ? [{ mark: "問", label: t("cmd.ask", { q }), kind: t("cmd.kind.enter"), ai: q }]
      : SAMPLE_QUESTIONS[lang].map((x) => ({ mark: "問", label: x, kind: t("cmd.kind.ai"), ai: x }));
    const lower = q.toLowerCase();
    const moves: Item[] = SECTIONS.map((s) => ({ s, name: t(`dest.${s.id}`) }))
      .filter(({ s, name }) => !q || name.toLowerCase().includes(lower) || s.kan.includes(q) || s.nav.toLowerCase().includes(lower))
      .map(({ s, name }) => ({ mark: s.mark, label: t("cmd.goto", { name }), kind: t("cmd.kind.move"), href: `#${s.id}` }));
    return [...asks, ...moves];
  }, [query, lang, t]);

  // 状態に合わせて <dialog> を開閉する。開くたびに入力を空にする
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (isOpen && !dlg.open) {
      dlg.showModal();
    } else if (!isOpen && dlg.open) {
      dlg.close();
    }
  }, [isOpen]);

  const reset = () => {
    setQuery("");
    setSelected(0);
  };

  const run = (item: Item | undefined) => {
    if (!item) return;
    close();
    if ("ai" in item) {
      ask(item.ai);
    } else {
      const target = document.querySelector<HTMLElement>(item.href);
      target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
      // 移動先の見出しから読み進められるよう、フォーカスもセクションへ移す
      window.setTimeout(() => {
        target?.setAttribute("tabindex", "-1");
        target?.focus({ preventScroll: true });
      }, 0);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = items.length;
      if (n) setSelected((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + n) % n);
    } else if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      run(items[selected]);
    }
  };

  const active = Math.min(selected, items.length - 1);

  return (
    <dialog
      id="cmd"
      ref={dialogRef}
      aria-label={t("cmd.label")}
      // Esc やフォームでの close を状態に反映する
      onClose={() => {
        close();
        reset();
      }}
      // 幕（dialog の外側）をクリックしたら閉じる
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <input
        id="cmd-q"
        type="search"
        role="combobox"
        aria-expanded="true"
        aria-controls="cmd-list"
        aria-autocomplete="list"
        aria-activedescendant={items.length ? `cmd-opt-${active}` : undefined}
        aria-label={t("cmd.placeholder")}
        placeholder={t("cmd.placeholder")}
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(0);
        }}
        onKeyDown={onKeyDown}
        autoFocus
      />
      <ul id="cmd-list" role="listbox" aria-label={t("cmd.label")}>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} role="presentation">
            <a
              id={`cmd-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onClick={() => run(item)}
              onMouseMove={() => setSelected(i)}
            >
              <i aria-hidden="true">{item.mark}</i>
              <span>{item.label}</span>
              <small>{item.kind}</small>
            </a>
          </li>
        ))}
        {items.length === 0 && <li className="none">{t("cmd.empty")}</li>}
      </ul>
      <div className="hint" aria-hidden="true">
        {t("cmd.hint")}
      </div>
    </dialog>
  );
}
