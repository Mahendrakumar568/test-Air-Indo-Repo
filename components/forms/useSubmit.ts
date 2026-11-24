"use client";
import { useRef, useState } from "react";

export type Status = "idle" | "sending" | "done" | "error";

export function useSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const renderedAt = useRef<number>(Date.now());

  async function submit(url: string, body: BodyInit, isJson: boolean) {
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch(url, {
        method: "POST",
        body,
        headers: isJson ? { "Content-Type": "application/json" } : undefined,
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Record<string, string> };
      if (res.ok && data.ok) {
        setStatus("done");
        return true;
      }
      if (data.errors) setErrors(data.errors);
      setStatus("error");
      return false;
    } catch {
      setStatus("error");
      return false;
    }
  }

  return { status, setStatus, errors, setErrors, submit, renderedAt };
}

export const focusFirstError = (form: HTMLFormElement | null, errors: Record<string, string>) => {
  const first = Object.keys(errors)[0];
  if (!first || !form) return;
  const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
  el?.focus();
};
