/* Circular trust-score indicator. Arc colour by range. */

interface TrustScoreProps {
  value: number; // 0-100
  size?: number;
}

function colorFor(v: number): string {
  if (v < 40) return "var(--crimson)";
  if (v < 70) return "var(--gold)";
  return "var(--green)";
}

export function TrustScore({ value, size = 48 }: TrustScoreProps) {
  const v = Math.max(0, Math.min(100, value));
  const stroke = size <= 40 ? 4 : 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;
  const color = colorFor(v);

  return (
    <div
      style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}
      role="img"
      aria-label={`Trust score ${v} out of 100`}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--paper-3)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--display)",
          fontWeight: 800,
          fontSize: size <= 40 ? 12 : 15,
          color: "var(--ink)",
        }}
      >
        {v}
      </span>
    </div>
  );
}
