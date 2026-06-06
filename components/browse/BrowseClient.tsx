"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { ListingCard } from "@/components/listing/ListingCard";
import { CATALOG } from "@/lib/catalog";
import { BROWSE_CATEGORIES } from "@/lib/listings";
import { rs } from "@/lib/format";
import type { Condition } from "@/lib/types";
import type { StringKey } from "@/lib/i18n";

type Sort = "new" | "low" | "high";
type Cat = (typeof BROWSE_CATEGORIES)[number];

const CONDITIONS: Condition[] = ["LIKE_NEW", "GOOD", "FAIR", "FOR_PARTS"];
const PRICE_BUCKETS = [0, 25000, 50000, 100000, 250000, 500000];

export function BrowseClient() {
  const { t, lang } = useT();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("all");
  const [conds, setConds] = useState<Set<Condition>>(new Set());
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState<Sort>("new");

  // hydrate filters from URL once
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("cat");
    if (c && (BROWSE_CATEGORIES as string[]).includes(c)) setCat(c as Cat);
    if (p.get("q")) setQ(p.get("q") as string);
    const s = p.get("sort");
    if (s === "low" || s === "high" || s === "new") setSort(s);
    const mx = Number(p.get("max"));
    if (mx) setMaxPrice(mx);
    const cond = p.get("cond");
    if (cond) setConds(new Set(cond.split(",").filter(Boolean) as Condition[]));
  }, []);

  // reflect filters to URL (shareable)
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat !== "all") p.set("cat", cat);
    if (q.trim()) p.set("q", q.trim());
    if (sort !== "new") p.set("sort", sort);
    if (maxPrice) p.set("max", String(maxPrice));
    if (conds.size) p.set("cond", [...conds].join(","));
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `/browse?${qs}` : "/browse");
  }, [cat, q, sort, maxPrice, conds]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = CATALOG.filter((it) => {
      if (cat !== "all" && it.cat !== cat) return false;
      if (conds.size && !conds.has(it.condition)) return false;
      if (maxPrice && it.price > maxPrice) return false;
      if (needle) {
        const hay = `${it.en} ${it.ne} ${it.loc.en}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.id - a.id);
    return list;
  }, [q, cat, conds, maxPrice, sort]);

  const toggleCond = (c: Condition) =>
    setConds((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  const clearAll = () => {
    setQ("");
    setCat("all");
    setConds(new Set());
    setMaxPrice(0);
    setSort("new");
  };

  const hasFilters = cat !== "all" || q.trim() || conds.size > 0 || maxPrice > 0;

  return (
    <>
      {/* header band */}
      <div style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "40px 28px 34px" }}>
          <span className="eyebrow">{t("browse.eyebrow")}</span>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", marginTop: 14 }}>
            {t("bp.title")}
          </h1>
          <p style={{ color: "var(--ink-2)", marginTop: 10, fontSize: 16, maxWidth: 540 }}>
            {t("bp.sub")}
          </p>

          {/* search + sort */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 22,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative", flex: "1 1 280px", minWidth: 240 }}>
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
                style={{ paddingLeft: 42, borderRadius: 999, background: "var(--paper)" }}
              />
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{t("bp.sort")}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="eb-input"
                style={{ width: "auto", borderRadius: 999, padding: "11px 14px" }}
              >
                <option value="new">{t("bp.sortNew")}</option>
                <option value="low">{t("bp.sortLow")}</option>
                <option value="high">{t("bp.sortHigh")}</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* filter bar */}
      <div className="wrap" style={{ paddingTop: 26 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {BROWSE_CATEGORIES.map((c) => {
            const on = cat === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setCat(c)}
                style={chip(on)}
              >
                {c === "all" ? t("browse.all") : t(`cat.${c}` as StringKey)}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {t("bp.condition")}
          </span>
          {CONDITIONS.map((c) => {
            const on = conds.has(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => toggleCond(c)}
                style={chip(on, true)}
              >
                {t(`cond.${c}` as StringKey)}
              </button>
            );
          })}

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginLeft: 6 }}>
            <span
              style={{
                fontSize: 13,
                color: "var(--ink-soft)",
                fontFamily: "var(--mono)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {t("bp.price")}
            </span>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="eb-input"
              style={{ width: "auto", borderRadius: 999, padding: "9px 12px", fontSize: 14 }}
            >
              {PRICE_BUCKETS.map((v) => (
                <option key={v} value={v}>
                  {v === 0 ? t("browse.all") : `< ${rs(v, lang)}`}
                </option>
              ))}
            </select>
          </label>

          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--mono)",
              fontSize: 12.5,
              color: "var(--ink-soft)",
            }}
          >
            {results.length} {t("bp.results")}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              style={{
                background: "none",
                border: "none",
                color: "var(--crimson)",
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              {t("bp.clear")}
            </button>
          )}
        </div>

        {/* grid */}
        {results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 0" }}>
            <p style={{ color: "var(--ink-soft)", fontSize: 16 }}>{t("bp.empty")}</p>
            <button
              type="button"
              onClick={clearAll}
              className="btn btn-ghost"
              style={{ marginTop: 16 }}
            >
              {t("bp.clear")}
            </button>
          </div>
        ) : (
          <div
            className="eb-listing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 22,
              margin: "26px 0 80px",
            }}
          >
            {results.map((it) => (
              <ListingCard key={it.id} it={it} condition={it.condition} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function chip(on: boolean, small = false): React.CSSProperties {
  return {
    border: "1px solid",
    borderColor: on ? "var(--ink)" : "var(--line-2)",
    background: on ? "var(--ink)" : "transparent",
    color: on ? "var(--paper)" : "var(--ink-2)",
    padding: small ? "7px 14px" : "9px 18px",
    borderRadius: 999,
    fontSize: small ? 13.5 : 14.5,
    fontWeight: 500,
    transition: "all .15s",
  };
}
