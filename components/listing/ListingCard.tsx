"use client";

import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { ConditionBadge } from "@/components/listing/ConditionBadge";
import { rs } from "@/lib/format";
import type { DemoListing } from "@/lib/listings";
import type { Condition } from "@/lib/types";

export function ListingCard({
  it,
  condition,
}: {
  it: DemoListing;
  condition?: Condition;
}) {
  const { t, lang } = useT();
  return (
    <Link
      href={`/listing/${it.id}`}
      className="card eb-listing"
      style={{ overflow: "hidden", cursor: "pointer", display: "block" }}
    >
      <div style={{ position: "relative" }}>
        <GeoThumb hue={it.hue} seed={it.id} height={150} />
        {condition && (
          <span style={{ position: "absolute", top: 10, left: 10 }}>
            <ConditionBadge condition={condition} overlay />
          </span>
        )}
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
