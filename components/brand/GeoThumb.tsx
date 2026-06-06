/* Geometric listing artwork — a deterministic peak/sun composition tinted by
   the item's hue. Used instead of stock photography. */

interface GeoThumbProps {
  hue?: number;
  seed?: number;
  height?: number;
}

export function GeoThumb({ hue = 28, seed = 1, height = 168 }: GeoThumbProps) {
  const c1 = `oklch(0.62 0.13 ${hue})`;
  const c2 = `oklch(0.72 0.10 ${hue})`;
  const c3 = `oklch(0.88 0.05 ${hue})`;
  const bg = `oklch(0.95 0.02 ${hue})`;

  // seed-driven variants keep each thumbnail distinct yet stable
  const sunX = 30 + ((seed * 23) % 50);
  const peakShift = ((seed * 13) % 24) - 12;

  return (
    <svg
      viewBox="0 0 300 180"
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="300" height="180" fill={bg} />
      <circle cx={sunX} cy="46" r="22" fill={c3} />
      <g opacity="0.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={20 + i * 8}
            x2="300"
            y2={20 + i * 8}
            stroke={c3}
            strokeWidth="1"
          />
        ))}
      </g>
      <path
        d={`M0,180 L${70 + peakShift},78 L120,120 L${180 + peakShift},58 L240,110 L300,72 L300,180 Z`}
        fill={c2}
      />
      <path
        d={`M0,180 L${110 + peakShift},104 L170,140 L${235 - peakShift},92 L300,134 L300,180 Z`}
        fill={c1}
      />
      <path
        d={`M${180 + peakShift},58 L${190 + peakShift},78 L${184 + peakShift},75 L${
          180 + peakShift
        },67 L${176 + peakShift},75 L${170 + peakShift},78 Z`}
        fill={c3}
      />
    </svg>
  );
}
