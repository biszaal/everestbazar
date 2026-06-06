"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { rs } from "@/lib/format";
import {
  BROWSE_CATEGORIES,
  LISTINGS,
  type DemoListing,
} from "@/lib/listings";
import type { StringKey } from "@/lib/i18n";

export function Browse() {
  const { t, lang } = useT();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof BROWSE_CATEGORIES)[number]>("all");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return LISTINGS.filter((it) => {
      if (cat !== "all" && it.cat !== cat) return false;
      if (needle) {
        const hay = `${it.en} ${it.ne} ${it.loc.en}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, cat]);

  return (
    <section id="browse" className="section">
      <div className="wrap">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          <div>
            <span className="eyebrow">{t("browse.eyebrow")}</span>
            <h2 style={{ fontSize: "clamp(30px,4vw,48px)", marginTop: 18 }}>
              {t("browse.title")}
            </h2>
          </div>
          <div style={{ position: "relative", minWidth: 280, flex: "1 1 280px", maxWidth: 360 }}>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--ink-soft)",
              }}
            >
              <Icon name="search" size={18} />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("browse.searchPh")}
              aria-label={t("browse.searchPh")}
              className="eb-input"
              style={{ paddingLeft: 42, borderRadius: 999 }}
            />
          </div>
        </div>

        {/* category chips */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 28,
            alignItems: "center",
          }}
        >
          {BROWSE_CATEGORIES.map((c) => {
            const on = cat === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setCat(c)}
                style={{
                  border: "1px solid",
                  borderColor: on ? "var(--ink)" : "var(--line-2)",
                  background: on ? "var(--ink)" : "transparent",
                  color: on ? "var(--paper)" : "var(--ink-2)",
                  padding: "9px 18px",
                  borderRadius: 999,
                  fontSize: 14.5,
                  fontWeight: 500,
                  transition: "all .15s",
                }}
              >
                {c === "all" ? t("browse.all") : t(`cat.${c}` as StringKey)}
              </button>
            );
          })}
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: 12.5,
              color: "var(--ink-soft)",
            }}
          >
            {list.length} {t("browse.count")}
          </span>
        </div>

        {/* grid / empty state */}
        {list.length === 0 ? (
          <p
            style={{
              marginTop: 50,
              textAlign: "center",
              color: "var(--ink-soft)",
            }}
          >
            {t("browse.empty")}
          </p>
        ) : (
          <div
            className="eb-listing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 22,
              marginTop: 30,
            }}
          >
            {list.map((it) => (
              <ListingCard key={it.id} it={it} />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 44 }}>
          <Link href="/browse" className="btn btn-ghost">
            {t("browse.cta")} <Icon name="arrow" size={18} sw={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ListingCard({ it }: { it: DemoListing }) {
  const { t, lang } = useT();
  return (
    <Link
      href={`/listing/${it.id}`}
      className="card eb-listing"
      style={{ overflow: "hidden", cursor: "pointer", display: "block" }}
    >
      <div style={{ position: "relative" }}>
        <GeoThumb hue={it.hue} seed={it.id} height={150} />
        <span
          className="badge"
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            background: "rgba(33,27,22,0.78)",
            color: "var(--paper)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          <Icon name="lock" size={12} sw={2.3} /> {t("browse.escrow")}
        </span>
      </div>
      <div style={{ padding: "14px 15px 16px" }}>
        <strong
          style={{
            fontFamily: "var(--display)",
            fontSize: 16,
            lineHeight: 1.2,
            display: "block",
          }}
        >
          {it[lang]}
        </strong>
        <div
          style={{
            fontFamily: "var(--display)",
            fontWeight: 800,
            color: "var(--crimson)",
            fontSize: 18,
            marginTop: 6,
          }}
        >
          {rs(it.price, lang)}
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>
          {it.loc[lang]}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
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
            <Icon name="star" size={13} stroke="var(--gold)" /> {it.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
