"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { ListingCard } from "@/components/listing/ListingCard";
import { BROWSE_CATEGORIES } from "@/lib/listings";
import { createClient } from "@/lib/supabase/client";
import { getActiveListings } from "@/lib/data";
import type { UiListing } from "@/lib/adapters";
import type { StringKey } from "@/lib/i18n";

export function Browse() {
  const { t } = useT();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof BROWSE_CATEGORIES)[number]>("all");
  const [items, setItems] = useState<UiListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getActiveListings(createClient())
      .then((rows) => alive && setItems(rows))
      .catch(() => alive && setItems([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items
      .filter((it) => {
        if (cat !== "all" && it.cat !== cat) return false;
        if (needle) {
          const hay = `${it.en} ${it.ne} ${it.loc.en}`.toLowerCase();
          if (!hay.includes(needle)) return false;
        }
        return true;
      })
      .slice(0, 8);
  }, [items, q, cat]);

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

        {/* grid / empty / loading */}
        {loading ? (
          <div
            className="eb-listing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 22,
              marginTop: 30,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="card"
                style={{ height: 248, background: "var(--paper-2)", border: "1px solid var(--line)" }}
              />
            ))}
          </div>
        ) : list.length === 0 ? (
          <p style={{ marginTop: 50, textAlign: "center", color: "var(--ink-soft)" }}>
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
              <ListingCard key={it.id} it={it} condition={it.condition} />
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
