"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Logo } from "@/components/brand/Logo";
import { PrayerLine } from "@/components/brand/PrayerLine";
import { Icon } from "@/components/brand/Icon";
import { LangToggle } from "@/components/layout/LangToggle";
import { useAuthStore, useAuthHydrated, useUser } from "@/store/authStore";
import { isAdmin } from "@/lib/admin";
import type { StringKey } from "@/lib/i18n";

const LINKS: [string, StringKey][] = [
  ["/browse", "nav.browse"],
  ["/#how", "nav.how"],
  ["/sell", "nav.sell"],
];

export function SiteHeader() {
  const { t } = useT();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="eb-site-header" style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <PrayerLine height={3} />
      <div
        style={{
          background: scrolled ? "rgba(246,240,230,0.86)" : "var(--paper)",
          backdropFilter: scrolled ? "saturate(150%) blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(150%) blur(12px)" : "none",
          borderBottom: "1px solid",
          borderColor: scrolled ? "var(--line)" : "transparent",
          transition: "background .25s, border-color .25s",
        }}
      >
        <div
          className="wrap"
          style={{ height: 70, display: "flex", alignItems: "center", gap: 24 }}
        >
          <Logo size={23} markSize={32} href="/" />
          <nav
            className="eb-navlinks"
            style={{ display: "flex", gap: 26, marginLeft: 18 }}
          >
            {LINKS.map(([href, key]) => {
              const active = href.startsWith("/") && !href.includes("#") && pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  className="eb-navlink"
                  aria-current={active ? "page" : undefined}
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: active ? "var(--crimson)" : "var(--ink-2)",
                  }}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <LangToggle />
            <AuthArea />
          </div>
        </div>
      </div>
    </header>
  );
}

function AuthArea() {
  const { t } = useT();
  const hydrated = useAuthHydrated();
  const user = useUser();

  if (hydrated && user) {
    return (
      <>
        <Link href="/sell" className="btn btn-primary btn-sm eb-header-sell">
          {t("nav.sellCta")}
        </Link>
        <AccountMenu />
      </>
    );
  }

  // server + pre-hydration default (and logged-out): Log in + Sell
  return (
    <>
      <Link
        href="/login"
        className="btn btn-ghost btn-sm eb-login-btn"
      >
        {t("nav.login")}
      </Link>
      <Link href="/sell" className="btn btn-primary btn-sm eb-header-sell">
        {t("nav.sellCta")}
      </Link>
    </>
  );
}

function AccountMenu() {
  const { t } = useT();
  const user = useUser();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!user) return null;
  const initial = (user.name.trim()[0] ?? user.email[0] ?? "?").toUpperCase();
  const verified = user.kycStatus === "VERIFIED";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("nav.account")}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 38,
          height: 38,
          borderRadius: 999,
          border: "1px solid var(--line-2)",
          background: "var(--paper-2)",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--display)",
          fontWeight: 800,
          fontSize: 15,
          color: "var(--ink)",
          position: "relative",
        }}
      >
        {initial}
        {verified && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              right: -2,
              bottom: -2,
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "var(--green)",
              border: "2px solid var(--paper)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="check" size={8} sw={3.4} stroke="var(--paper)" />
          </span>
        )}
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: 48,
            width: 220,
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 14,
            boxShadow: "var(--shadow-lg)",
            padding: 8,
            zIndex: 60,
          }}
        >
          <div style={{ padding: "8px 10px 10px" }}>
            <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 15 }}>
              {user.name || t("nav.account")}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", fontFamily: "var(--mono)" }}>
              {user.email}
            </div>
            {verified && (
              <span className="badge badge-verified" style={{ marginTop: 8 }}>
                <Icon name="check" size={12} sw={2.8} /> {t("hero.verified")}
              </span>
            )}
          </div>
          <div style={{ height: 1, background: "var(--line)", margin: "4px 0" }} />
          <Link role="menuitem" href="/profile" onClick={() => setOpen(false)} className="eb-menu-item">
            {t("nav.profile")}
          </Link>
          <Link role="menuitem" href="/purchases" onClick={() => setOpen(false)} className="eb-menu-item">
            {t("nav.purchases")}
          </Link>
          <Link role="menuitem" href="/sales" onClick={() => setOpen(false)} className="eb-menu-item">
            {t("nav.sales")}
          </Link>
          <Link role="menuitem" href="/chat" onClick={() => setOpen(false)} className="eb-menu-item">
            {t("nav.chat")}
          </Link>
          {isAdmin(user.id) && (
            <Link role="menuitem" href="/admin/kyc" onClick={() => setOpen(false)} className="eb-menu-item">
              {t("nav.adminKyc")}
            </Link>
          )}
          <div style={{ height: 1, background: "var(--line)", margin: "4px 0" }} />
          <button
            role="menuitem"
            type="button"
            className="eb-menu-item"
            onClick={() => {
              logout();
              setOpen(false);
              router.push("/");
            }}
          >
            {t("nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
