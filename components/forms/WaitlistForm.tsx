"use client";
import { useRef } from "react";
import Link from "next/link";
import { cityList, connectionsOf, type CityCode } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/lib/dict/en";
import { useSubmit, focusFirstError } from "./useSubmit";
import { Field } from "./Field";

type Props = {
  locale: Locale;
  t: Dict["forms"];
  names: Record<CityCode, string>;
  defaultFrom?: CityCode | "";
  source?: string;
  idPrefix?: string;
};

export function WaitlistForm({ locale, t, names, defaultFrom = "", source = "home", idPrefix = "wl" }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const { status, errors, setErrors, submit, renderedAt } = useSubmit();
  const msg = (k?: string) => (k ? (t as unknown as Record<string, string>)[k] ?? t.required : undefined);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const local: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) local.email = "invalidEmail";
    if (!fd.get("consent")) local.consent = "consentRequired";
    if (Object.keys(local).length) {
      setErrors(local);
      focusFirstError(formRef.current, local);
      return;
    }
    await submit(
      "/api/waitlist",
      JSON.stringify({
        email,
        name: fd.get("name") || "",
        from: fd.get("from") || "",
        to: fd.get("to") || "",
        consent: true,
        locale,
        source,
        website: fd.get("website") || "",
        ts: renderedAt.current,
      }),
      true,
    );
  }

  if (status === "done") {
    return (
      <div className="form-success" role="status">
        <h3>{t.successTitle}</h3>
        <p>{t.waitlist.success}</p>
      </div>
    );
  }

  const id = (s: string) => `${idPrefix}-${s}`;
  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <Field id={id("from")} label={t.waitlist.from} optional={t.optional}>
          <select id={id("from")} name="from" className="select" defaultValue={defaultFrom}>
            <option value="">{t.waitlist.any}</option>
            {cityList.map((c) => (
              <option key={c.code} value={c.code}>
                {names[c.code]} ({c.code})
              </option>
            ))}
          </select>
        </Field>
        <Field id={id("to")} label={t.waitlist.to} optional={t.optional}>
          <select id={id("to")} name="to" className="select" defaultValue={defaultFrom ? connectionsOf(defaultFrom as CityCode)[0] : ""}>
            <option value="">{t.waitlist.any}</option>
            {cityList.map((c) => (
              <option key={c.code} value={c.code}>
                {names[c.code]} ({c.code})
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="form-row">
        <Field id={id("name")} label={t.name} optional={t.optional}>
          <input id={id("name")} name="name" className="input" autoComplete="name" maxLength={120} />
        </Field>
        <Field id={id("email")} label={t.email} error={msg(errors.email)}>
          <input
            id={id("email")}
            name="email"
            type="email"
            className="input"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? id("email-err") : undefined}
          />
        </Field>
      </div>
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
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.waitlist.submit}
        </button>
        <p className="fine" style={{ marginTop: 10 }}>{t.waitlist.fine}</p>
      </div>
      <div aria-live="polite">{status === "error" && <p className="form-status bad">{Object.keys(errors).length ? t.invalid : t.error}</p>}</div>
    </form>
  );
}
