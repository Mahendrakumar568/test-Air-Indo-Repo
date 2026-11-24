/**
 * One source of truth for the planned network. Every map, card, explorer and
 * destination page reads from here, so routes can never contradict each other.
 */
export type CityCode = "VTZ" | "VGA" | "HYD" | "GOI" | "BHO" | "PNQ";

export type City = {
  code: CityCode;
  slug: string;
  lat: number;
  lon: number;
  /** label placement on the network map */
  label: { dx: number; dy: number; anchor: "start" | "end" };
};

export const cities: Record<CityCode, City> = {
  VTZ: { code: "VTZ", slug: "visakhapatnam", lat: 17.72, lon: 83.22, label: { dx: 14, dy: -12, anchor: "start" } },
  VGA: { code: "VGA", slug: "vijayawada", lat: 16.53, lon: 80.8, label: { dx: 14, dy: 20, anchor: "start" } },
  HYD: { code: "HYD", slug: "hyderabad", lat: 17.24, lon: 78.43, label: { dx: -14, dy: -12, anchor: "end" } },
  GOI: { code: "GOI", slug: "goa", lat: 15.38, lon: 73.83, label: { dx: 14, dy: 20, anchor: "start" } },
  BHO: { code: "BHO", slug: "bhopal", lat: 23.29, lon: 77.34, label: { dx: 14, dy: -6, anchor: "start" } },
  PNQ: { code: "PNQ", slug: "pune", lat: 18.58, lon: 73.92, label: { dx: -14, dy: -12, anchor: "end" } },
};

export const cityList = Object.values(cities);
export const cityBySlug = (slug: string) => cityList.find((c) => c.slug === slug);

export type CorridorId = "c1" | "c2" | "c3";
export type Corridor = { id: CorridorId; legs: [CityCode, CityCode][] };

export const corridors: Corridor[] = [
  { id: "c1", legs: [["VTZ", "VGA"], ["VGA", "HYD"]] },
  { id: "c2", legs: [["VGA", "GOI"]] },
  { id: "c3", legs: [["HYD", "BHO"], ["BHO", "PNQ"]] },
];

export const allLegs = corridors.flatMap((c) => c.legs.map((l) => ({ corridor: c.id, from: l[0], to: l[1] })));

/** Great-circle distance in km. */
export const distanceKm = (a: CityCode, b: CityCode) => {
  const A = cities[a];
  const B = cities[b];
  const r = Math.PI / 180;
  const dLat = (B.lat - A.lat) * r;
  const dLon = (B.lon - A.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(A.lat * r) * Math.cos(B.lat * r) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)));
};

/** Estimated block time in minutes for an ATR 72-600 (cruise ~430 km/h effective, plus taxi and climb). */
export const blockMinutes = (km: number) => Math.round((km / 430) * 60 + 15);

export const connectionsOf = (code: CityCode): CityCode[] =>
  allLegs.flatMap((l) => (l.from === code ? [l.to] : l.to === code ? [l.from] : []));

export const corridorOf = (a: CityCode, b: CityCode): CorridorId | null =>
  allLegs.find((l) => (l.from === a && l.to === b) || (l.from === b && l.to === a))?.corridor ?? null;

export const corridorsOfCity = (code: CityCode) =>
  corridors.filter((c) => c.legs.some((l) => l.includes(code))).map((c) => c.id);

/** Simple equirectangular projection into the map viewBox (0 0 600 520). */
export const project = (code: CityCode) => {
  const c = cities[code];
  const minLon = 71.5, maxLon = 86, minLat = 13.5, maxLat = 25;
  return {
    x: Math.round(((c.lon - minLon) / (maxLon - minLon)) * 540 + 30),
    y: Math.round(((maxLat - c.lat) / (maxLat - minLat)) * 460 + 30),
  };
};

/* ------------------------------------------------------------------ */

export const fleetSpecs = [
  { key: "seats", value: "70–72" },
  { key: "range", value: "1,528 km" },
  { key: "cruise", value: "510 km/h" },
  { key: "ceiling", value: "25,000 ft" },
  { key: "engines", value: "2 × PW127XT" },
  { key: "runway", value: "~1,300 m" },
] as const;

export const phases = [
  { key: "p1", aircraft: "3" },
  { key: "p2", aircraft: "6" },
  { key: "p3", aircraft: "10+" },
] as const;

export const milestones = [
  { key: "moca", state: "done" },
  { key: "mha", state: "done" },
  { key: "dgca", state: "current" },
  { key: "aop", state: "next" },
  { key: "first", state: "next" },
] as const;

export const jobs = [
  { id: "captain-atr72", dept: "flight", location: "VGA", type: "full" },
  { id: "first-officer-atr72", dept: "flight", location: "VGA", type: "full" },
  { id: "cabin-crew", dept: "cabin", location: "VTZ", type: "full" },
  { id: "ame-b1-b2", dept: "engineering", location: "HYD", type: "full" },
  { id: "occ-dispatcher", dept: "ops", location: "VGA", type: "full" },
  { id: "airport-customer-service", dept: "airport", location: "VTZ", type: "full" },
  { id: "safety-quality-manager", dept: "safety", location: "VGA", type: "full" },
  { id: "revenue-network-analyst", dept: "commercial", location: "HYD", type: "full" },
] as const;
export type JobId = (typeof jobs)[number]["id"];

export const newsPosts = [
  { slug: "dgca-application-update", tag: "regulatory", image: "news1" },
  { slug: "why-the-atr-72-600", tag: "fleet", image: "fleet" },
  { slug: "india-post-air-mail-partnership", tag: "cargo", image: "news3" },
  { slug: "three-corridors-from-andhra", tag: "network", image: "news2" },
] as const;
export type NewsSlug = (typeof newsPosts)[number]["slug"];

export const enquiryTopics = ["investor", "partnership", "cargo", "media", "career", "general"] as const;
export type EnquiryTopic = (typeof enquiryTopics)[number];
