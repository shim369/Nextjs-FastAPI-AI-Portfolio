"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion } from "./motion";
import { useChat } from "./useChat";

type ChatUI = ReturnType<typeof useChat> & {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** パネルを開いて質問を送る（ヒーローの質問バー・⌘K パレットから使う） */
  ask: (question: string) => void;
};

const Context = createContext<ChatUI | null>(null);

// パネルが右から出きってから質問を送る（デザイン案と同じ間）
const ASK_DELAY_MS = 450;

/** AIチャットの会話と、パネルの開閉をまとめて持つ。会話はパネルを閉じても残る */
export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChat();
  const [isOpen, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const { send } = chat;

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const ask = useCallback(
    (question: string) => {
      if (!question.trim()) return;
      setOpen(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => send(question), prefersReducedMotion() ? 0 : ASK_DELAY_MS);
    },
    [send]
  );

  const value = useMemo<ChatUI>(() => ({ ...chat, isOpen, open, close, ask }), [chat, isOpen, open, close, ask]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useChatUI(): ChatUI {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useChatUI must be used inside ChatProvider");
  return ctx;
}
