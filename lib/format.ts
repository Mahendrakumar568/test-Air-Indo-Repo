export const fmtTime = (m: number, h: string, min: string) => {
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  if (!hh) return `${mm}${min}`;
  return mm ? `${hh}${h} ${mm}${min}` : `${hh}${h}`;
};
