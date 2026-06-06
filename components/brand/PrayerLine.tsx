/* Prayer-flag hairline — the five Himalayan flag colours as a thin band. */

const COLORS = [
  "var(--pf-blue)",
  "var(--pf-white)",
  "var(--pf-red)",
  "var(--pf-green)",
  "var(--pf-yellow)",
];

export function PrayerLine({
  height = 3,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div className={`pf-line${className ? ` ${className}` : ""}`} style={{ height }}>
      {COLORS.map((c, i) => (
        <i key={i} style={{ background: c }} />
      ))}
    </div>
  );
}
