"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { jobs } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/lib/dict/en";
import { CV_MAX_BYTES, CV_TYPES } from "@/lib/upload";
import { useSubmit, focusFirstError } from "./useSubmit";
import { Field } from "./Field";

type Props = { locale: Locale; t: Dict["forms"]; jobTitles: Record<string, string> };

export function CareerForm({ locale, t, jobTitles }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [role, setRole] = useState("");
  const { status, errors, setErrors, submit, renderedAt } = useSubmit();
  const msg = (k?: string) =>
    k ? ((t as unknown as Record<string, string>)[k] ?? (t.career as Record<string, string>)[k] ?? t.required) : undefined;
  const id = (s: string) => `cr-${s}`;

  // Pre-select a role from ?role= or from the job list's Apply buttons (#apply-<id>).
  useEffect(() => {
    const pick = () => {
      const fromHash = window.location.hash.startsWith("#apply-") ? window.location.hash.slice(7) : "";
      const fromQuery = new URLSearchParams(window.location.search).get("role") || "";
      const r = fromHash || fromQuery;
      if (r && (r === "general" || jobs.some((j) => j.id === r))) setRole(r);
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) || "").trim();
    const local: Record<string, string> = {};
    if (v("name").length < 2) local.name = "required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) local.email = "invalidEmail";
    if (!/^[+()\d\s-]{7,20}$/.test(v("phone"))) local.phone = "invalidPhone";
    if (!v("role")) local.role = "required";
    if (v("linkedin") && !/^https?:\/\/\S+$/i.test(v("linkedin"))) local.linkedin = "required";
    const cv = fd.get("cv");
    if (cv instanceof File && cv.size > 0) {
      if (cv.size > CV_MAX_BYTES) local.cv = "cvTooLarge";
      else if (cv.type && !CV_TYPES.includes(cv.type)) local.cv = "cvType";
    }
    if (!fd.get("consent")) local.consent = "consentRequired";
    if (Object.keys(local).length) {
      setErrors(local);
      focusFirstError(formRef.current, local);
      return;
    }
    fd.set("consent", "true");
    fd.set("locale", locale);
    fd.set("ts", String(renderedAt.current));
    await submit("/api/careers", fd, false);
  }

  if (status === "done") {
    return (
      <div className="form-success" role="status">
        <h3>{t.successTitle}</h3>
        <p>{t.career.success}</p>
      </div>
    );
  }

  const inv = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? id(`${k}-err`) : undefined });

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate encType="multipart/form-data">
      <Field id={id("role")} label={t.career.role} error={msg(errors.role)}>
        <select id={id("role")} name="role" className="select" value={role} onChange={(e) => setRole(e.target.value)} required {...inv("role")}>
          <option value="" disabled>
            {t.career.chooseRole}
          </option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {jobTitles[j.id]}
            </option>
          ))}
          <option value="general">{t.career.general}</option>
        </select>
      </Field>
      <div className="form-row">
        <Field id={id("name")} label={t.name} error={msg(errors.name)}>
          <input id={id("name")} name="name" className="input" autoComplete="name" required maxLength={120} {...inv("name")} />
        </Field>
        <Field id={id("email")} label={t.email} error={msg(errors.email)}>
          <input id={id("email")} name="email" type="email" className="input" autoComplete="email" required {...inv("email")} />
        </Field>
      </div>
      <div className="form-row">
        <Field id={id("phone")} label={t.phone} error={msg(errors.phone)}>
          <input id={id("phone")} name="phone" type="tel" className="input" autoComplete="tel" inputMode="tel" required {...inv("phone")} />
        </Field>
        <Field id={id("city")} label={t.city} optional={t.optional}>
          <input id={id("city")} name="city" className="input" autoComplete="address-level2" maxLength={80} />
        </Field>
      </div>
      <div className="form-row">
        <Field id={id("experience")} label={t.career.experience} optional={t.optional}>
          <input id={id("experience")} name="experience" type="number" min={0} max={60} className="input" inputMode="numeric" />
        </Field>
        <Field id={id("licence")} label={t.career.licence} optional={t.optional}>
          <input id={id("licence")} name="licence" className="input" maxLength={80} />
        </Field>
      </div>
      <Field id={id("linkedin")} label={t.career.linkedin} optional={t.optional} error={msg(errors.linkedin)}>
        <input id={id("linkedin")} name="linkedin" type="url" className="input" placeholder="https://" {...inv("linkedin")} />
      </Field>
      <Field id={id("cv")} label={t.career.cv} optional={t.optional} error={msg(errors.cv)}>
        <input
          id={id("cv")}
          name="cv"
          type="file"
          className="input file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          {...inv("cv")}
        />
      </Field>
      <Field id={id("message")} label={t.career.cover} optional={t.optional}>
        <textarea id={id("message")} name="message" className="textarea" maxLength={4000} />
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
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.career.submit}
        </button>
      </div>
      <div aria-live="polite">{status === "error" && <p className="form-status bad">{Object.keys(errors).length ? t.invalid : t.error}</p>}</div>
    </form>
  );
}
