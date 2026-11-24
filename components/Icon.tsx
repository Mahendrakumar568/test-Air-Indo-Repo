type Props = { name: IconName; size?: number; className?: string };
export type IconName =
  | "arrow" | "swap" | "check" | "shield" | "route" | "fare" | "heart" | "plane" | "seat" | "language"
  | "food" | "bag" | "access" | "clock" | "mail" | "phone" | "pin" | "parcel" | "people" | "chart" | "leaf" | "spark" | "download";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  swap: <path d="M7 4v16M7 4L3 8M7 4l4 4M17 20V4M17 20l-4-4M17 20l4-4" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  route: <><circle cx="5" cy="18" r="2.2" /><circle cx="19" cy="6" r="2.2" /><path d="M7 17c6-1 4-9 10-10" strokeDasharray="2 3" /></>,
  fare: <><rect x="3" y="6" width="18" height="12" rx="1.5" /><path d="M3 10h18M7 15h4" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" />,
  plane: <path d="M2.5 13.5l7 1.5 4.5 6 1.5-.5-1.5-6.5 6-2c1.5-.5 1.5-2.5 0-3l-6 .5L9 3.5 7.5 4l1.5 6-5 1-1.5-2L1.5 9.5z" />,
  seat: <><path d="M7 4v9a2 2 0 002 2h7" /><path d="M7 13h8l2 7" /><path d="M10 15l-1 5" /></>,
  language: <><path d="M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c0 4-3 7-7 9" /><path d="M13 21l4-9 4 9M14.5 18h5" /></>,
  food: <><path d="M4 11h16a8 8 0 01-16 0z" /><path d="M9 4c0 1.5 1 1.5 1 3M13 4c0 1.5 1 1.5 1 3" /></>,
  bag: <><rect x="5" y="7" width="14" height="13" rx="1.5" /><path d="M9 7V4.5h6V7M9 11v5M15 11v5" /></>,
  access: <><circle cx="12" cy="4.5" r="1.8" /><path d="M7 8.5l5 1 5-1M12 9.5V14l-3 6M12 14l3 6" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3.5 6l8.5 7 8.5-7" /></>,
  phone: <path d="M5 3.5h3.5l1.5 4.5-2.2 1.4a11 11 0 005.8 5.8l1.4-2.2 4.5 1.5V18a2 2 0 01-2 2A16 16 0 013 5.5a2 2 0 012-2z" />,
  pin: <><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  parcel: <><path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9M7.8 5.3l8.5 4.5" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.5-3.3 2.7-5 5.5-5s5 1.7 5.5 5" /><circle cx="17" cy="9" r="2.3" /><path d="M16 14c2.6 0 4.2 1.6 4.6 4.5" /></>,
  chart: <path d="M4 20V4M4 20h16M8 16l4-5 3 3 5-7" />,
  leaf: <><path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" /><path d="M5 19l7-7" /></>,
  spark: <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
};

export function Icon({ name, size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
