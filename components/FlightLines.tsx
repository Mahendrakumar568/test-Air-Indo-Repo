/** The brand's "flight lines" device: circles radiating from the saffron home point. */
export function FlightLines({ className = "flight-lines", rings = 9, dot = true }: { className?: string; rings?: number; dot?: boolean }) {
  const cx = 160;
  const cy = 640;
  return (
    <svg className={className} viewBox="0 0 1100 800" fill="none" aria-hidden="true" focusable="false">
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx={cx} cy={cy} r={90 + i * 95} stroke="#8D97C2" strokeOpacity={0.22 - i * 0.012} strokeWidth={1.2} />
      ))}
      {dot && <circle cx={cx} cy={cy} r={16} fill="#E8862A" />}
    </svg>
  );
}
