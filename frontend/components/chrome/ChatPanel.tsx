"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MAX_INPUT_LENGTH, SAMPLE_QUESTIONS } from "@/lib/config";
import { useChatUI } from "@/lib/chat-ui";
import { useI18n } from "@/lib/i18n";
import type { ChatMessage } from "@/lib/useChat";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * AIチャットパネル：右からスライドして出る。開いている間はフォーカスをパネルの中に閉じ込め、
 * Esc・幕のクリック・「閉じる」で閉じて、開く前の場所へフォーカスを戻す
 */
export default function ChatPanel() {
  const { t, lang } = useI18n();
  const { messages, busy, send, retry, isOpen, close } = useChatUI();
  const [draft, setDraft] = useState("");
  const panelRef = useRef<HTMLElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  // 開いたら入力欄へ、閉じたら開く前にいた場所へフォーカスを移す
  useEffect(() => {
    if (isOpen) {
      if (!panelRef.current?.contains(document.activeElement)) {
        returnTo.current = document.activeElement as HTMLElement | null;
      }
      // スライドが始まってから移す（visibility が切り替わる前だとフォーカスできない）
      const id = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
      return () => window.clearTimeout(id);
    }
    const back = returnTo.current;
    returnTo.current = null;
    if (back && document.contains(back) && back !== document.body) back.focus({ preventScroll: true });
  }, [isOpen]);

  // Esc で閉じる（⌘K パレットが開いているときはパレット側が先に Esc を受ける）
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // 会話が増えたら、常に一番下を見せる
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  const submit = () => {
    if (send(draft)) setDraft("");
  };

  const onInputKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  // Tab / Shift+Tab をパネルの中で循環させる
  const trapFocus = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <div className={`chat-veil${isOpen ? " open" : ""}`} onClick={close} aria-hidden="true" />
      <aside
        id="chat-panel"
        ref={panelRef}
        className={isOpen ? "open" : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-title"
        inert={!isOpen}
        onKeyDown={trapFocus}
      >
        <div className="c-head">
          <h2 id="chat-title">
            <i aria-hidden="true">{t("chat.mark")}</i>
            {t("chat.title")}
          </h2>
          <button type="button" onClick={close} aria-label={t("chat.closeLabel")}>
            {t("chat.close")}
          </button>
        </div>
        <div className="c-log" ref={logRef} aria-live="polite" aria-busy={busy}>
          {messages.map((m) => (
            <Message key={m.id} message={m} onRetry={retry} />
          ))}
        </div>
        <div className="c-qs" role="group" aria-label={t("chat.samples")}>
          {SAMPLE_QUESTIONS[lang].map((q) => (
            <button key={q} type="button" onClick={() => send(q)} disabled={busy}>
              {q}
            </button>
          ))}
        </div>
        <form
          className="c-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <textarea
            ref={inputRef}
            className="c-input"
            aria-label={t("chat.inputLabel")}
            rows={1}
            placeholder={t("chat.placeholder")}
            maxLength={MAX_INPUT_LENGTH}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onInputKey}
            enterKeyHint="send"
          />
          <button className="c-send" type="submit" disabled={busy || !draft.trim()}>
            {t("chat.send")}
          </button>
        </form>
        <p className="c-note">{t("chat.notice")}</p>
      </aside>
    </>
  );
}

function Message({ message: m, onRetry }: { message: ChatMessage; onRetry: (id: number) => void }) {
  const { t } = useI18n();
  switch (m.kind) {
    case "greeting":
      return (
        <div className="c-msg c-bot">
          <p>{t("chat.greeting")}</p>
        </div>
      );
    case "user":
      return (
        <div className="c-msg c-user">
          <p>{m.text}</p>
        </div>
      );
    case "ai":
      return (
        <div className="c-msg c-bot">
          {m.tools.length > 0 && (
            <div className="c-tools">
              {m.tools.map((name, i) => (
                <span key={i} className="c-tool">
                  {t("chat.toolRun", { name })}
                </span>
              ))}
            </div>
          )}
          {m.loading ? (
            <p className="c-loading">{t("chat.loading")}</p>
          ) : (
            <p style={{ whiteSpace: "pre-wrap" }}>{m.text}</p>
          )}
          {m.notes.map((code) => (
            <p key={code} className="c-sub">
              {t(`chat.notice.${code}`)}
            </p>
          ))}
        </div>
      );
    case "error":
      return (
        <div className="c-err" role="alert">
          <p style={{ margin: 0 }}>{m.message}</p>
          {m.requestId && <small>{t("error.requestId", { id: m.requestId })}</small>}
          {m.retryable && (
            <button type="button" onClick={() => onRetry(m.id)}>
              {t("chat.retry")}
            </button>
          )}
        </div>
      );
  }
}
