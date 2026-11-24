import { z } from "zod";
import { enquiryTopics, jobs, cityList } from "./data";
import { locales } from "./i18n";

const cityCodes = cityList.map((c) => c.code) as [string, ...string[]];
const trimmed = (max: number) => z.string().trim().max(max);
const phone = z
  .string()
  .trim()
  .max(20)
  .regex(/^[+()\d\s-]{7,20}$/, "invalidPhone");

const base = {
  locale: z.enum(locales).default("en"),
  /** honeypot: must stay empty */
  website: z.string().max(0).optional().default(""),
  /** ms timestamp when the form was rendered */
  ts: z.coerce.number().optional(),
};

export const waitlistSchema = z.object({
  ...base,
  email: z.string().trim().toLowerCase().email("invalidEmail").max(200),
  name: trimmed(120).optional().default(""),
  from: z.enum(cityCodes).or(z.literal("")).optional().default(""),
  to: z.enum(cityCodes).or(z.literal("")).optional().default(""),
  source: trimmed(80).optional().default(""),
  consent: z.literal(true, { message: "consentRequired" }),
});

export const contactSchema = z.object({
  ...base,
  name: trimmed(120).min(2, "required"),
  email: z.string().trim().toLowerCase().email("invalidEmail").max(200),
  phone: phone.or(z.literal("")).optional().default(""),
  organisation: trimmed(160).optional().default(""),
  topic: z.enum(enquiryTopics, { message: "required" }),
  message: trimmed(5000).min(10, "required"),
  consent: z.literal(true, { message: "consentRequired" }),
});

const jobIds = jobs.map((j) => j.id) as unknown as [string, ...string[]];

export const careerSchema = z.object({
  ...base,
  name: trimmed(120).min(2, "required"),
  email: z.string().trim().toLowerCase().email("invalidEmail").max(200),
  phone: phone,
  role: z.enum([...jobIds, "general"] as [string, ...string[]], { message: "required" }),
  city: trimmed(80).optional().default(""),
  experience: z.coerce.number().int().min(0).max(60).optional(),
  licence: trimmed(80).optional().default(""),
  linkedin: z.string().trim().url("required").max(300).or(z.literal("")).optional().default(""),
  message: trimmed(4000).optional().default(""),
  consent: z.literal(true, { message: "consentRequired" }),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type CareerInput = z.infer<typeof careerSchema>;

export { CV_MAX_BYTES, CV_TYPES } from "./upload";

/** Flatten zod issues into { field: code }. Codes map to dictionary keys on the client. */
export const issuesToErrors = (issues: z.core.$ZodIssue[]) => {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const key = String(i.path[0] ?? "form");
    if (out[key]) continue;
    const msg = i.message;
    out[key] = ["invalidEmail", "invalidPhone", "consentRequired", "required"].includes(msg) ? msg : "required";
  }
  return out;
};
