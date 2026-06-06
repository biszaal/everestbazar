"use client";

import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { rs } from "@/lib/format";

export function Hero() {
  const { t } = useT();
  return (
    <section id="top" style={{ position: "relative", overflow: "hidden" }}>
      <HeroBackdrop />
      <div
        className="wrap"
        style={{ position: "relative", zIndex: 2, padding: "70px 28px 88px" }}
      >
        <div
          className="eb-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div>
            <span className="eyebrow">{t("hero.eyebrow")}</span>
            <h1
              style={{
                fontSize: "clamp(44px, 6.4vw, 82px)",
                margin: "20px 0 0",
              }}
            >
              <span style={{ display: "block" }}>{t("hero.h1a")}</span>
              <span style={{ display: "block", color: "var(--crimson)" }}>
                {t("hero.h1b")}
              </span>
            </h1>
            <p
              style={{
                fontSize: "clamp(17px,1.6vw,20px)",
                color: "var(--ink-2)",
                maxWidth: 540,
                marginTop: 22,
              }}
            >
              {t("hero.sub")}
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 30,
                flexWrap: "wrap",
              }}
            >
              <Link href="/browse" className="btn btn-primary">
                {t("hero.cta1")} <Icon name="arrow" size={18} sw={2.2} />
              </Link>
              <Link href="/sell" className="btn btn-ghost">
                {t("hero.cta2")}
              </Link>
            </div>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12.5,
                color: "var(--ink-soft)",
                marginTop: 28,
                maxWidth: 460,
                lineHeight: 1.6,
              }}
            >
              {t("hero.note")}
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <HeroCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 1440 720"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="eb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F6F0E6" />
            <stop offset="1" stopColor="#EFE6D4" />
          </linearGradient>
        </defs>
        <rect width="1440" height="720" fill="url(#eb-sky)" />
        <circle cx="1180" cy="150" r="80" fill="oklch(0.9 0.05 60)" opacity="0.6" />
        <path
          d="M0,720 L240,430 L380,520 L620,360 L820,520 L1040,380 L1260,520 L1440,440 L1440,720 Z"
          fill="oklch(0.9 0.035 60)"
        />
        <path
          d="M0,720 L320,520 L520,610 L760,470 L1000,600 L1240,500 L1440,600 L1440,720 Z"
          fill="oklch(0.86 0.05 50)"
        />
      </svg>
    </div>
  );
}

function HeroCard() {
  const { t, lang } = useT();
  return (
    <div style={{ position: "relative", maxWidth: 380, margin: "0 auto" }}>
      <div
        className="card eb-float"
        style={{
          overflow: "hidden",
          borderRadius: 22,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ position: "relative" }}>
          <GeoThumb hue={28} seed={4} height={210} />
          <span
            className="badge"
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              background: "rgba(33,27,22,0.78)",
              color: "var(--paper)",
            }}
          >
            <Icon name="lock" size={13} sw={2.2} /> {t("hero.escrow")}
          </span>
        </div>
        <div style={{ padding: "16px 18px 18px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <strong
              style={{
                fontFamily: "var(--display)",
                fontSize: 18,
                flex: "1 1 auto",
                lineHeight: 1.2,
              }}
            >
              {t("hero.cardTitle")}
            </strong>
            <span
              style={{
                fontFamily: "var(--display)",
                fontWeight: 800,
                color: "var(--crimson)",
                fontSize: 18,
                whiteSpace: "nowrap",
                flex: "0 0 auto",
              }}
            >
              {rs(78000, lang)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
              color: "var(--ink-soft)",
              fontSize: 14,
            }}
          >
            <span>{t("hero.cardLoc")}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid var(--line)",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                background: "var(--paper-3)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--display)",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              आ
            </span>
            <span className="badge badge-verified">
              <Icon name="check" size={13} sw={2.6} /> {t("hero.verified")}
            </span>
            <span
              style={{
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: 13.5,
                color: "var(--ink-2)",
              }}
            >
              <Icon name="star" size={14} stroke="var(--gold)" /> 4.9
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
