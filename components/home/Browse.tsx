"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingGridSkeleton } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase/client";
import { getActiveListings } from "@/lib/data";
import type { UiListing } from "@/lib/adapters";

/** Homepage "fresh listings" teaser. Search + category filters live in the
 *  header and on /browse — this is just the latest items + a link through. */
export function Browse() {
  const { t } = useT();
  const [items, setItems] = useState<UiListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getActiveListings(createClient())
      .then((rows) => alive && setItems(rows.slice(0, 8)))
      .catch(() => alive && setItems([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="browse" className="section">
      <div className="wrap">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div>
            <span className="eyebrow">{t("browse.eyebrow")}</span>
            <h2 style={{ fontSize: "clamp(24px,3.4vw,36px)", marginTop: 14 }}>
              {t("browse.title")}
            </h2>
          </div>
          <Link href="/browse" className="btn btn-ghost btn-sm">
            {t("browse.cta")} <Icon name="arrow" size={16} sw={2.2} />
          </Link>
        </div>

        {loading ? (
          <ListingGridSkeleton count={4} style={{ marginTop: 24, marginBottom: 0 }} />
        ) : items.length === 0 ? (
          <p style={{ marginTop: 44, textAlign: "center", color: "var(--ink-soft)" }}>
            {t("browse.empty")}
          </p>
        ) : (
          <div
            className="eb-listing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 20,
              marginTop: 24,
            }}
          >
            {items.map((it) => (
              <ListingCard key={it.id} it={it} condition={it.condition} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
