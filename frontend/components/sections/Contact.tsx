"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Fude from "@/components/svg/Fude";
import { useI18n } from "@/lib/i18n";
import { getRecaptchaToken, loadRecaptcha } from "@/lib/recaptcha";
import Section from "./Section";

const API_URL = "/api/contact";
// サーバー（backend/app/schemas.py）と同じ上限
const LIMITS = { name: 100, email: 254, message: 2000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// サーバーが返すエラーコードのうち、特定の入力欄に結びつくもの
const FIELD_OF_CODE: Record<string, FieldName> = {
  name_required: "name",
  name_too_long: "name",
  email_required: "email",
  invalid_email: "email",
  message_required: "message",
  message_too_long: "message",
};
type FieldName = "name" | "email" | "message";
type Values = Record<FieldName, string>;

/** 最初に見つかった入力エラー（欄と文言キー） */
function validate(values: Values): { field: FieldName; key: string } | null {
  if (!values.name) return { field: "name", key: "contact.error.name_required" };
  if (values.name.length > LIMITS.name) return { field: "name", key: "contact.error.name_too_long" };
  if (!values.email) return { field: "email", key: "contact.error.email_required" };
  if (values.email.length > LIMITS.email || !EMAIL_PATTERN.test(values.email))
    return { field: "email", key: "contact.error.invalid_email" };
  if (!values.message) return { field: "message", key: "contact.error.message_required" };
  if (values.message.length > LIMITS.message) return { field: "message", key: "contact.error.message_too_long" };
  return null;
}

/** 連絡：説明文を縦書きの明朝で大きく組み、下線だけの入力欄のフォームを置く。送信は reCAPTCHA v3 で検証してから /api/contact へ */
export default function Contact() {
  const { t, lang } = useI18n();
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [invalid, setInvalid] = useState<FieldName | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // 送信完了の知らせは、少し出してから消す
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(id);
  }, [toast]);

  // reCAPTCHA の読み込みはフォームに触れたときに始める
  const warm = () => void loadRecaptcha().catch(() => {});

  const update = (name: FieldName, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    // 入力し直したら、その欄のエラーを消す
    if (invalid === name) {
      setInvalid(null);
      setErrorKey(null);
    }
  };

  const showFieldError = (field: FieldName, key: string) => {
    setInvalid(field);
    setErrorKey(key);
    ({ name: nameRef, email: emailRef, message: messageRef })[field].current?.focus();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const trimmed: Values = { name: values.name.trim(), email: values.email.trim(), message: values.message.trim() };
    const found = validate(trimmed);
    if (found) {
      showFieldError(found.field, found.key);
      return;
    }
    setInvalid(null);
    setErrorKey(null);
    setBusy(true);

    let token = "";
    try {
      token = await getRecaptchaToken();
    } catch {
      setBusy(false);
      setErrorKey("contact.error.recaptcha_load");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...trimmed, recaptcha_token: token, lang }),
      });
      if (res.ok) {
        setValues({ name: "", email: "", message: "" });
        setToast("contact.success");
        return;
      }
      const data = await res.json().catch(() => ({}));
      const code: string = data.code || "contact_failed";
      const field = FIELD_OF_CODE[code];
      if (field) {
        showFieldError(field, `contact.error.${code}`);
      } else {
        const key = `contact.error.${code}`;
        setErrorKey(t(key) === key ? "contact.error.contact_failed" : key);
      }
    } catch {
      setErrorKey("contact.error.network");
    } finally {
      setBusy(false);
    }
  }

  const fieldProps = (name: FieldName) => ({
    name,
    value: values[name],
    "aria-invalid": invalid === name,
    "aria-describedby": invalid === name ? "contact-error" : undefined,
  });

  return (
    <Section id="contact">
      <div className="contact">
        <div>
          <p className="lead" lang={lang}>
            {t("contact.lead")
              .split("\n")
              .map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
          </p>
          <Fude className="sec-fude" />
        </div>
        <form className="cf" noValidate onSubmit={onSubmit} onFocus={warm} aria-label={t("dest.contact")}>
          <label>
            {t("contact.name")}
            <input
              {...fieldProps("name")}
              ref={nameRef}
              autoComplete="name"
              maxLength={LIMITS.name}
              required
              onChange={(e) => update("name", e.target.value)}
            />
          </label>
          <label>
            {t("contact.email")}
            <input
              {...fieldProps("email")}
              ref={emailRef}
              type="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              required
              onChange={(e) => update("email", e.target.value)}
            />
          </label>
          <label>
            {t("contact.message")}
            <textarea
              {...fieldProps("message")}
              ref={messageRef}
              rows={5}
              maxLength={LIMITS.message}
              required
              onChange={(e) => update("message", e.target.value)}
            />
          </label>
          <div className="row">
            <button className="btn-sumi" type="submit" disabled={busy} aria-busy={busy}>
              <i aria-hidden="true" />
              {busy ? t("contact.sending") : t("contact.submit")}
            </button>
            <span className="f-err" id="contact-error" role="alert">
              {errorKey ? t(errorKey) : ""}
            </span>
          </div>
          {/* reCAPTCHA のバッジは隠さず出すと右下のパネルと重なるため、Google の規定どおり文言で表示する */}
          <small>
            {t("contact.recaptcha1")}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
              {t("contact.privacy")}
            </a>
            {t("contact.recaptcha2")}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener">
              {t("contact.terms")}
            </a>
            {t("contact.recaptcha3")}
          </small>
        </form>
      </div>
      <div id="toast" className={toast ? "show" : undefined} role="status">
        {toast ? t(toast) : ""}
      </div>
    </Section>
  );
}
