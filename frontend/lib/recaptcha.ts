import { RECAPTCHA_SITE_KEY } from "./config";

// サーバー（backend/app/contact.py の RECAPTCHA_ACTION）と揃える
export const RECAPTCHA_ACTION = "contact";

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (key: string, opts: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

// reCAPTCHA は Google のスクリプトを読み込むため、フォームを操作し始めたときに初めて読み込む
let recaptchaPromise: Promise<Grecaptcha | null> | null = null;

export function loadRecaptcha(): Promise<Grecaptcha | null> {
  if (!RECAPTCHA_SITE_KEY) return Promise.resolve(null);
  if (!recaptchaPromise) {
    recaptchaPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
      script.async = true;
      script.onload = () => window.grecaptcha!.ready(() => resolve(window.grecaptcha!));
      script.onerror = () => {
        // 次の送信時に読み込みをやり直せるようにする
        recaptchaPromise = null;
        script.remove();
        reject(new Error("failed to load reCAPTCHA"));
      };
      document.head.append(script);
    });
  }
  return recaptchaPromise;
}

/** 送信用のトークンを取る。サイトキーが空なら空文字（サーバー側も検証しない設定のとき） */
export async function getRecaptchaToken(): Promise<string> {
  const grecaptcha = await loadRecaptcha();
  return grecaptcha ? grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: RECAPTCHA_ACTION }) : "";
}
