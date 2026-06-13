"use client";

import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { ConditionBadge } from "@/components/listing/ConditionBadge";
import { rs } from "@/lib/format";
import type { Lang } from "@/lib/i18n";
import type { Condition } from "@/lib/types";

/** Accepts both the static demo listing (numeric id) and the DB-backed UiListing
 *  (uuid id + explicit seed). */
export interface ListingCardItem {
  id: string | number;
  hue: number;
  en: string;
  ne: string;
  price: number;
  loc: Record<Lang, string>;
  rating: number;
  seed?: number;
  photoUrls?: string[];
}

export function ListingCard({
  it,
  condition,
}: {
  it: ListingCardItem;
  condition?: Condition;
}) {
  const { t, lang } = useT();
  const thumbSeed = it.seed ?? (typeof it.id === "number" ? it.id : 1);

  return (
    <Link
      href={`/listing/${it.id}`}
      className="card eb-listing"
      style={{ overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}
    >
      {/* image */}
      <div style={{ position: "relative", height: 168, background: "var(--paper-3)" }}>
        {it.photoUrls && it.photoUrls[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={it.photoUrls[0]}
            alt={it.en}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <GeoThumb hue={it.hue} seed={thumbSeed} height={168} />
        )}
        {condition && (
          <span style={{ position: "absolute", top: 9, left: 9 }}>
            <ConditionBadge condition={condition} overlay />
          </span>
        )}
      </div>

      {/* body */}
      <div style={{ padding: "11px 12px 13px", display: "flex", flexDirection: "column", flex: 1 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--ink)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 36,
          }}
        >
          {it[lang]}
        </span>

        <div
          style={{
            fontFamily: "var(--display)",
            fontWeight: 800,
            color: "var(--crimson)",
            fontSize: 19,
            marginTop: 7,
            letterSpacing: "-0.01em",
          }}
        >
          {rs(it.price, lang)}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 6,
            fontSize: 12.5,
            color: "var(--ink-soft)",
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            {it.loc[lang]}
          </span>
          <span aria-hidden="true">·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 2, flex: "0 0 auto" }}>
            <Icon name="star" size={12} stroke="var(--gold)" /> {it.rating.toFixed(1)}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid var(--line)",
          }}
        >
          <span className="badge badge-verified" style={{ fontSize: 11.5, padding: "3px 8px" }}>
            <Icon name="check" size={11} sw={2.8} /> {t("browse.verified")}
          </span>
          <span
            className="badge badge-escrow"
            style={{ fontSize: 11.5, padding: "3px 8px", marginLeft: "auto" }}
          >
            <Icon name="lock" size={10} sw={2.3} /> {t("browse.escrow")}
          </span>
        </div>
      </div>
    </Link>
  );
}
