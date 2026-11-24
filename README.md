# Air Indo website

The official website for Air Indo, Andhra Pradesh's regional airline. Built with Next.js (App Router) and deployed on Vercel.

## Features

- **Pages:** home, our story, routes and six destination pages, fleet, experience, cargo, investors, careers, newsroom with articles, contact, privacy and terms.
- **Three languages:** English (`/en`), Telugu (`/te`) and Hindi (`/hi`). The first visit is redirected by the browser's language, and the switch remembers the choice in a cookie.
- **Working forms:** waitlist, contact and enquiries, and job applications with CV upload. Each is validated on the client and the server, protected by a honeypot, timing check and rate limit, and saved to private Vercel Blob storage.
- **Email alerts (optional):** set `RESEND_API_KEY` and `NOTIFY_EMAIL_TO` to get an email for every submission.
- **Admin:** `/admin` lists every submission, downloads CVs and exports CSV. It is protected by HTTP basic auth (user `admin`, password `ADMIN_PASSWORD`).
- **SEO:** canonical URLs, `hreflang` alternates, Open Graph images, sitemap, robots, and Airline, JobPosting, NewsArticle and FAQ structured data.
- **Accessibility:** skip link, landmarks, labelled form fields with inline errors, keyboard focus styles, reduced-motion support.

## One source of truth

- Routes, cities, distances and flight-time estimates: `lib/data.ts`
- All copy, in three languages: `lib/dict/en.ts`, `te.ts`, `hi.ts` (Telugu and Hindi are typed against English, so a missing string fails the build)
- Images: `lib/images.ts` and `lib/alts.ts`; files in `public/images`
- Company contact details: `lib/site.ts` (or the `NEXT_PUBLIC_*` environment variables)
- Legal text: `lib/legal.ts`

## Develop

```bash
npm install
cp .env.example .env.local   # optional; without storage, submissions are logged to the console
npm run dev
```

## Environment variables

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store for submissions and CVs (set automatically when the store is connected) |
| `ADMIN_PASSWORD` | Password for `/admin` (username `admin`) |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | Optional email alerts |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (default `https://airindo.in`) |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_REGISTERED_ADDRESS`, `NEXT_PUBLIC_CIN`, `NEXT_PUBLIC_MEDIA_EMAIL` | Contact details shown on the site; "To be confirmed" when empty |

## Before launch

- Have the Telugu and Hindi copy reviewed by native speakers.
- Add the real contact details, registered office and CIN.
- Connect email alerts and point the domain `airindo.in` at the Vercel project.
