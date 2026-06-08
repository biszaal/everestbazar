"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { TrustScore } from "@/components/user/TrustScore";
import { ListingCard } from "@/components/listing/ListingCard";
import { ReviewItem } from "@/components/user/Review";
import type { UiListing, UiSeller } from "@/lib/adapters";
import type { Review } from "@/lib/reviews";

export function PublicProfile({
  seller,
  listings,
  reviews,
}: {
  seller: Pick<UiSeller, "name" | "initial" | "verified" | "trust" | "sales" | "since">;
  listings: UiListing[];
  reviews: Review[];
}) {
  const { t } = useT();
  return (
    <div className="wrap" style={{ padding: "34px 28px 90px", maxWidth: 980 }}>
      {/* header */}
      <div className="card" style={{ padding: "26px 26px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <span
          style={{
            width: 70,
            height: 70,
            borderRadius: 999,
            background: "var(--paper-3)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--display)",
            fontWeight: 800,
            fontSize: 28,
            flex: "0 0 auto",
          }}
        >
          {seller.initial}
        </span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 26 }}>{seller.name}</h1>
            {seller.verified && (
              <span className="badge badge-verified">
                <Icon name="check" size={12} sw={2.8} /> {t("browse.verified")}
              </span>
            )}
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 8 }}>
            {seller.sales} {t("ld.sales")} · {t("ld.memberSince")} {seller.since}
          </div>
        </div>
        <TrustScore value={seller.trust} size={64} />
      </div>

      {/* active listings */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 22 }}>{t("pf.activeListings")}</h2>
        {listings.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", marginTop: 14 }}>{t("pf.noListings")}</p>
        ) : (
          <div
            className="eb-listing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 22,
              marginTop: 18,
            }}
          >
            {listings.map((it) => (
              <ListingCard key={it.id} it={it} condition={it.condition} />
            ))}
          </div>
        )}
      </section>

      {/* reviews */}
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22 }}>{t("pf.tabReviews")}</h2>
        <div style={{ marginTop: 8, maxWidth: 620 }}>
          {reviews.map((r, i) => (
            <ReviewItem key={i} review={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
