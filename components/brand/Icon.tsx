/* Simple geometric line icons — drawn as inline SVG (no icon dependency). */

import type { ReactElement } from "react";

export type IconName =
  | "id"
  | "lock"
  | "scales"
  | "search"
  | "check"
  | "arrow"
  | "shield"
  | "box"
  | "coin"
  | "upload"
  | "star"
  | "phone"
  | "mail"
  | "monitor"
  | "car"
  | "sofa"
  | "house"
  | "shirt"
  | "cart"
  | "heart"
  | "tag"
  | "truck";

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: string;
  /** stroke width */
  sw?: number;
  className?: string;
}

export function Icon({
  name,
  size = 26,
  stroke = "currentColor",
  sw = 1.9,
  className,
}: IconProps) {
  const paths: Record<IconName, ReactElement> = {
    id: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8" cy="11" r="2" />
        <path d="M6.5 16c.4-1.2 1.5-2 2.5-2s2.1.8 2.5 2M14 9h4M14 13h4M14 16h2.5" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        <path d="M12 15v2" />
      </>
    ),
    scales: (
      <>
        <path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 5a3 3 0 0 0 5 0L5 8zM19 8l-2.5 5a3 3 0 0 0 5 0L19 8z" />
        <circle cx="12" cy="4" r="1.4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.2-3.2" />
      </>
    ),
    check: <path d="M5 12.5 10 17.5 19.5 7" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    shield: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    box: (
      <>
        <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
        <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
      </>
    ),
    coin: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M9.5 10h3.2a1.5 1.5 0 0 1 0 3H9.5h3.5" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V5M8 9l4-4 4 4" />
        <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
      </>
    ),
    star: (
      <path
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"
        fill={stroke}
        stroke="none"
      />
    ),
    phone: (
      <>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M10.5 18.5h3" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 7.5 8.5 6 8.5-6" />
      </>
    ),
    monitor: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M9 21h6M12 17v4" />
      </>
    ),
    car: (
      <>
        <path d="M5 11l1.7-4.3A2 2 0 0 1 8.6 5.4h6.8a2 2 0 0 1 1.9 1.3L19 11" />
        <path d="M3 11h18v4.5a1 1 0 0 1-1 1h-1M5 16.5H4a1 1 0 0 1-1-1V11" />
        <circle cx="7.5" cy="16.5" r="1.6" />
        <circle cx="16.5" cy="16.5" r="1.6" />
      </>
    ),
    sofa: (
      <>
        <path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11" />
        <rect x="3" y="11" width="18" height="5.5" rx="2" />
        <path d="M6.5 16.5v2M17.5 16.5v2" />
      </>
    ),
    house: (
      <>
        <path d="M4 11.5 12 4l8 7.5" />
        <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      </>
    ),
    shirt: (
      <path d="M8.5 4 5 6.5 7 9l1.5-1.1V20h7V7.9L17 9l2-2.5L15.5 4a3.5 3.5 0 0 1-7 0z" />
    ),
    cart: (
      <>
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="17" cy="20" r="1.4" />
        <path d="M3 4h2.2l2 11.2a1 1 0 0 0 1 .8h7.6a1 1 0 0 0 1-.8L20 7.5H6.2" />
      </>
    ),
    heart: (
      <path d="M12 20S4.5 15.5 4.5 9.9A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7.5 2.9C19.5 15.5 12 20 12 20z" />
    ),
    tag: (
      <>
        <path d="M3.5 12.6V4.6a1 1 0 0 1 1-1h8l8 8-9 9-8-8z" />
        <circle cx="8" cy="8" r="1.3" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6.5h11v9H3z" />
        <path d="M14 9.5h3.6L21 13v2.5h-7z" />
        <circle cx="7" cy="17.5" r="1.4" />
        <circle cx="17" cy="17.5" r="1.4" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
