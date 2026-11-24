"use client";
import { useRef } from "react";
import Link from "next/link";
import { enquiryTopics, type EnquiryTopic } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/lib/dict/en";
import { useSubmit, focusFirstError } from "./useSubmit";
import { Field } from "./Field";

type Props = { locale: Locale; t: Dict["forms"]; defaultTopic?: EnquiryTopic | ""; idPrefix?: string };

export function ContactForm({ locale, t, defaultTopic = "", idPrefix = "ct" }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const { status, errors, setErrors, submit, renderedAt } = useSubmit();
  const msg = (k?: string) => (k ? (t as unknown as Record<string, string>)[k] ?? t.required : undefined);
  const id = (s: string) => `${idPrefix}-${s}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) || "").trim();
    const local: Record<string, string> = {};
    if (v("name").length < 2) local.name = "required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) local.email = "invalidEmail";
    if (v("phone") && !/^[+()\d\s-]{7,20}$/.test(v("phone"))) local.phone = "invalidPhone";
    if (!v("topic")) local.topic = "required";
    if (v("message").length < 10) local.message = "required";
    if (!fd.get("consent")) local.consent = "consentRequired";
    if (Object.keys(local).length) {
      setErrors(local);
      focusFirstError(formRef.current, local);
      return;
    }
    await submit(
      "/api/contact",
      JSON.stringify({
        name: v("name"),
        email: v("email"),
        phone: v("phone"),
        organisation: v("organisation"),
        topic: v("topic"),
        message: v("message"),
        consent: true,
        locale,
        website: v("website"),
        ts: renderedAt.current,
      }),
      true,
    );
  }

  if (status === "done") {
    return (
      <div className="form-success" role="status">
        <h3>{t.successTitle}</h3>
        <p>{t.contactSuccess}</p>
      </div>
    );
  }

  const inv = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? id(`${k}-err`) : undefined });

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <Field id={id("name")} label={t.name} error={msg(errors.name)}>
          <input id={id("name")} name="name" className="input" autoComplete="name" required maxLength={120} {...inv("name")} />
        </Field>
        <Field id={id("email")} label={t.email} error={msg(errors.email)}>
          <input id={id("email")} name="email" type="email" className="input" autoComplete="email" required {...inv("email")} />
        </Field>
      </div>
      <div className="form-row">
        <Field id={id("phone")} label={t.phone} optional={t.optional} error={msg(errors.phone)}>
          <input id={id("phone")} name="phone" type="tel" className="input" autoComplete="tel" inputMode="tel" {...inv("phone")} />
        </Field>
        <Field id={id("organisation")} label={t.organisation} optional={t.optional}>
          <input id={id("organisation")} name="organisation" className="input" autoComplete="organization" maxLength={160} />
        </Field>
      </div>
      <Field id={id("topic")} label={t.topic} error={msg(errors.topic)}>
        <select id={id("topic")} name="topic" className="select" defaultValue={defaultTopic} required {...inv("topic")}>
          <option value="" disabled>
            {t.chooseTopic}
          </option>
          {enquiryTopics.map((k) => (
            <option key={k} value={k}>
              {t.topics[k]}
            </option>
          ))}
        </select>
      </Field>
      <Field id={id("message")} label={t.message} error={msg(errors.message)}>
        <textarea id={id("message")} name="message" className="textarea" required maxLength={5000} {...inv("message")} />
      </Field>
      <div className="hp" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="check">
        <input type="checkbox" name="consent" aria-invalid={!!errors.consent} />
        <span>
          {t.consent} <Link href={`/${locale}/privacy`}>{t.privacyLink}</Link>.
          {errors.consent && <span className="err">{msg(errors.consent)}</span>}
        </span>
      </label>
      <div>
        <button className="btn btn-navy" type="submit" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </button>
      </div>
      <div aria-live="polite">{status === "error" && <p className="form-status bad">{Object.keys(errors).length ? t.invalid : t.error}</p>}</div>
    </form>
  );
}
