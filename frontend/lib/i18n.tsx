"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { MESSAGES, type Lang, type MessageKey } from "./messages";
import type { Localized } from "./config";

const STORAGE_KEY = "lang";
const SUPPORTED: Lang[] = ["ja", "en"];

type Vars = Record<string, string | number>;

type I18n = {
  lang: Lang;
  setLang: (next: Lang) => void;
  /** 固定の文言（{name} の形のプレースホルダーを vars で置き換える） */
  t: (key: MessageKey | (string & {}), vars?: Vars) => string;
  /** { ja, en } 形式の値から現在の言語を選ぶ */
  pick: (value: Localized) => string;
};

// 英語の文言に抜けがあれば型エラーにする
const EN_HAS_ALL_KEYS: Record<MessageKey, string> = MESSAGES.en;
void EN_HAS_ALL_KEYS;

const Context = createContext<I18n | null>(null);

// 保存済みの言語（localStorage）を外部の状態として読む。切り替えたら購読しているコンポーネントへ知らせる
const listeners = new Set<() => void>();
// localStorage が使えない環境でも、切り替え自体はこのタブの中で効かせる
let memoryLang: Lang | null = null;

function readSavedLang(): Lang {
  // このタブで切り替えた言語を優先する（保存に失敗していても切り替えが効くように）
  if (memoryLang) return memoryLang;
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {
    // localStorage が使えない環境
  }
  return "ja";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // サーバーと hydration 中は日本語（既定）。ビルド時に作る HTML は日本語なので表示がずれない。
  // 保存済みの言語があれば、hydration のあとに切り替わる
  const lang = useSyncExternalStore(subscribe, readSavedLang, () => "ja" as const);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = MESSAGES[lang]["meta.title"];
    document.querySelector('meta[name="description"]')?.setAttribute("content", MESSAGES[lang]["meta.description"]);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    memoryLang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 保存できなくても切り替え自体は行う
    }
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo<I18n>(() => {
    const t: I18n["t"] = (key, vars) => {
      const table = MESSAGES[lang] as Record<string, string>;
      let text = table[key] ?? (MESSAGES.ja as Record<string, string>)[key] ?? key;
      for (const [name, v] of Object.entries(vars ?? {})) text = text.replaceAll(`{${name}}`, String(v));
      return text;
    };
    const pick: I18n["pick"] = (v) => v[lang] ?? v.ja;
    return { lang, setLang, t, pick };
  }, [lang, setLang]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
