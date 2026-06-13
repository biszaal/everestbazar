"use client";

import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { rs } from "@/lib/format";

/** Compact, trust-forward banner with an on-brand "verified listing"
 *  illustration. Search + categories live in the header. */
export function MarketHero() {
  const { t } = useT();
  return (
    <section style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--line)", overflow: "hidden" }}>
      <div
        className="wrap eb-hero-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 44,
          alignItems: "center",
          padding: "46px 28px",
        }}
      >
        <div>
          <span className="eyebrow">{t("mh.eyebrow")}</span>
          <h1 style={{ fontSize: "clamp(27px,4vw,44px)", marginTop: 14, maxWidth: 520 }}>
            {t("mh.title")}
          </h1>
          <p
            style={{
              color: "var(--ink-2)",
              marginTop: 12,
              fontSize: 16.5,
              lineHeight: 1.6,
              maxWidth: 520,
            }}
          >
            {t("mh.sub")}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
            <span className="badge badge-verified">
              <Icon name="check" size={13} sw={2.8} /> {t("mh.chipVerified")}
            </span>
            <span className="badge badge-escrow">
              <Icon name="lock" size={12} sw={2.3} /> {t("mh.chipEscrow")}
            </span>
            <span className="badge" style={{ background: "var(--paper-3)", color: "var(--ink-2)" }}>
              {t("mh.chipCity")}
            </span>
          </div>

          <Link href="/browse" className="btn btn-primary" style={{ marginTop: 22 }}>
            {t("mh.cta")} <Icon name="arrow" size={18} sw={2.2} stroke="#fff" />
          </Link>
        </div>

        <HeroArt />
      </div>
    </section>
  );
}

function HeroArt() {
  const { t, lang } = useT();
  return (
    <div
      className="eb-hero-art"
      style={{ position: "relative", minHeight: 300, display: "grid", placeItems: "center" }}
    >
      {/* soft tinted depth */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-6%",
          bottom: "-6%",
          width: 230,
          height: 230,
          borderRadius: 999,
          background: "color-mix(in oklab, var(--crimson) 12%, transparent)",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-4%",
          top: "-4%",
          width: 140,
          height: 140,
          borderRadius: 999,
          background: "color-mix(in oklab, var(--steel) 12%, transparent)",
        }}
      />

      {/* back card (peeking, rotated) */}
      <div
        className="card"
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 220,
          transform: "rotate(-7deg) translate(-44px, 28px)",
          overflow: "hidden",
        }}
      >
        <GeoThumb hue={205} seed={11} height={126} />
        <div style={{ height: 44 }} />
      </div>

      {/* front card — a verified, escrow-protected listing */}
      <div
        className="card"
        style={{ position: "relative", zIndex: 2, width: "min(298px, 100%)", overflow: "hidden" }}
      >
        <div style={{ position: "relative" }}>
          <GeoThumb hue={14} seed={6} height={172} />
          <span
            className="badge"
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(33,27,22,0.8)",
              color: "#fff",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          >
            <Icon name="lock" size={12} sw={2.3} stroke="#fff" /> {t("ld.protected")}
          </span>
        </div>
        <div style={{ padding: "14px 16px 16px" }}>
          <div
            style={{
              fontFamily: "var(--display)",
              fontWeight: 800,
              color: "var(--crimson)",
              fontSize: 22,
              letterSpacing: "-0.01em",
            }}
          >
            {rs(78000, lang)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
              paddingTop: 12,
              borderTop: "1px solid var(--line)",
            }}
          >
            <span className="badge badge-verified">
              <Icon name="check" size={12} sw={2.8} /> {t("browse.verified")}
            </span>
            <span
              style={{
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: 13,
                color: "var(--ink-2)",
              }}
            >
              <Icon name="star" size={13} stroke="var(--gold)" /> 4.9
            </span>
          </div>
        </div>
      </div>

      {/* floating verified medallion */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "13%",
          top: "8%",
          zIndex: 3,
          width: 46,
          height: 46,
          borderRadius: 999,
          background: "var(--green)",
          display: "grid",
          placeItems: "center",
          boxShadow: "var(--shadow)",
        }}
      >
        <Icon name="shield" size={24} sw={2} stroke="#fff" />
      </span>
    </div>
  );
}
