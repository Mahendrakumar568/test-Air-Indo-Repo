/**
 * Every image slot on the site, with its real pixel size. Photographs live in
 * /public/images; the brand-style SVG illustrations in /public/img are the fallback set.
 */
export type ImageSlot = { src: string; width: number; height: number };

const wide = (f: string): ImageSlot => ({ src: `/images/${f}`, width: 1536, height: 864 });
const card = (f: string): ImageSlot => ({ src: `/images/${f}`, width: 1536, height: 1024 });
const tall = (f: string): ImageSlot => ({ src: `/images/${f}`, width: 1024, height: 1280 });

export const images = {
  hero: wide("hero-home.webp"),
  heroAlt: wide("hero-home-alt.webp"),
  fleet: wide("fleet-atr72.webp"),
  investors: wide("investors-hero.webp"),
  cabin: card("cabin.webp"),
  crew: card("crew.webp"),
  cargo: card("cargo.webp"),
  checkin: card("airport-checkin.webp"),
  boarding: card("airport-boarding.webp"),
  arrival: card("passengers-arrival.webp"),
  careersTeam: card("careers-team.webp"),
  careersTraining: card("careers-training.webp"),
  heritage: card("about-heritage.webp"),
  meal: card("experience-meal.webp"),
  news1: card("newsroom-1.webp"),
  news2: card("newsroom-2.webp"),
  news3: card("newsroom-3.webp"),
  office: card("contact-office.webp"),
  VTZ: tall("dest-vtz.webp"),
  VGA: tall("dest-vga.webp"),
  HYD: tall("dest-hyd.webp"),
  GOI: tall("dest-goi.webp"),
  BHO: tall("dest-bho.webp"),
  PNQ: tall("dest-pnq.webp"),
} satisfies Record<string, ImageSlot>;

export type ImageKey = keyof typeof images;

export const ogImages = {
  default: "/images/og-default.jpg",
  routes: "/images/og-routes.jpg",
  careers: "/images/og-careers.jpg",
} as const;
