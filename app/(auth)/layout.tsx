import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { PrayerLine } from "@/components/brand/PrayerLine";
import { LangToggle } from "@/components/layout/LangToggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--paper)",
      }}
    >
      <PrayerLine height={3} />
      <div
        className="wrap"
        style={{
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo size={23} markSize={32} href="/" />
        <LangToggle />
      </div>
      <div
        style={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          padding: "16px 20px 72px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>{children}</div>
      </div>
    </div>
  );
}
