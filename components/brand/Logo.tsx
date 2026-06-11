import { SummitMark } from "@/components/brand/SummitMark";

interface LogoProps {
  size?: number;
  /** colour of "Everest" */
  a?: string;
  /** colour of "Bazar" */
  b?: string;
  /** mark fill */
  mark?: string;
  /** snow-cap fill */
  snow?: string;
  markSize?: number;
  href?: string;
}

export function Logo({
  size = 30,
  a = "var(--ink)",
  b = "var(--crimson)",
  mark = "var(--crimson)",
  snow = "var(--paper)",
  markSize,
  href = "#top",
}: LogoProps) {
  return (
    <a
      href={href}
      aria-label="EverestBazar — home"
      style={{ display: "inline-flex", alignItems: "center", gap: 11 }}
    >
      <SummitMark fill={mark} snow={snow} size={markSize ?? Math.round(size * 1.5)} />
      <span
        className="eb-logo-word"
        style={{
          fontFamily: "var(--display)",
          fontWeight: 800,
          fontSize: size,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: a }}>Everest</span>
        <span style={{ color: b }}>Bazar</span>
      </span>
    </a>
  );
}
