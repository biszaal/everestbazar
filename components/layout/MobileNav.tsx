"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import type { ReactNode } from "react";
import type { StringKey } from "@/lib/i18n";

function TabIcon({ name }: { name: "home" | "grid" | "chat" }) {
  const common = {
    width: 23,
    height: 23,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "home")
    return (
      <svg {...common}>
        <path d="M4 11.5 12 4l8 7.5" />
        <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      </svg>
    );
  if (name === "grid")
    return (
      <svg {...common}>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function MobileNav() {
  const { t } = useT();
  const pathname = usePathname();

  const tabs: { href: string; label: StringKey; icon: ReactNode }[] = [
    { href: "/", label: "nav.home", icon: <TabIcon name="home" /> },
    { href: "/browse", label: "nav.browse", icon: <TabIcon name="grid" /> },
    { href: "/chat", label: "nav.chat", icon: <TabIcon name="chat" /> },
  ];

  return (
    <nav
      className="eb-mobilenav"
      aria-label="Primary"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        gridTemplateColumns: "1fr 1fr 84px 1fr",
        alignItems: "end",
        background: "rgba(246,240,230,0.92)",
        backdropFilter: "saturate(150%) blur(12px)",
        WebkitBackdropFilter: "saturate(150%) blur(12px)",
        borderTop: "1px solid var(--line)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        height: 64,
      }}
    >
      <Tab {...tabs[0]} active={pathname === "/"} t={t} />
      <Tab {...tabs[1]} active={pathname.startsWith("/browse")} t={t} />
      {/* center elevated Sell */}
      <div style={{ position: "relative", height: "100%" }}>
        <Link
          href="/sell"
          aria-label={t("nav.sell")}
          style={{
            position: "absolute",
            left: "50%",
            bottom: 12,
            transform: "translateX(-50%)",
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "var(--crimson)",
            color: "var(--paper)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 8px 20px rgba(190,58,43,.36)",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Link>
        <span
          style={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            fontWeight: 600,
            color: pathname.startsWith("/sell") || pathname.startsWith("/listing/new") ? "var(--crimson)" : "var(--ink-soft)",
          }}
        >
          {t("nav.sell")}
        </span>
      </div>
      <Tab {...tabs[2]} active={pathname.startsWith("/chat")} t={t} />
    </nav>
  );
}

function Tab({
  href,
  label,
  icon,
  active,
  t,
}: {
  href: string;
  label: StringKey;
  icon: ReactNode;
  active: boolean;
  t: (k: StringKey) => string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        height: "100%",
        color: active ? "var(--crimson)" : "var(--ink-soft)",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {icon}
      {t(label)}
    </Link>
  );
}
