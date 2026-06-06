/* The "Summit" logo mark — abstract Everest range with a snow-capped crown. */

interface SummitMarkProps {
  fill?: string;
  snow?: string;
  size?: number;
  className?: string;
}

export function SummitMark({
  fill = "var(--crimson)",
  snow = "var(--paper)",
  size = 40,
  className,
}: SummitMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      style={{ display: "block" }}
    >
      <path d="M4,88 L26,52 L38,66 L56,20 L74,58 L84,46 L96,88 Z" fill={fill} />
      <path d="M56,20 L66,46 L60,44 L56,33 L52,44 L46,46 Z" fill={snow} />
    </svg>
  );
}
