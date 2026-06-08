"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { ConditionBadge } from "@/components/listing/ConditionBadge";
import { ListingCard } from "@/components/listing/ListingCard";
import { TrustScore } from "@/components/user/TrustScore";
import { useUser } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { openConversation } from "@/lib/data";
import { rs } from "@/lib/format";
import type { UiListing } from "@/lib/adapters";

export function ListingDetailClient({
  listing,
  related,
}: {
  listing: UiListing;
  related: UiListing[];
}) {
  const { t, lang } = useT();
  const router = useRouter();
  const user = useUser();
  const [photo, setPhoto] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const desc = listing.description[lang];
  const longDesc = desc.length > 200;

  const messageSeller = async () => {
    if (!user) {
      router.push(`/login?redirect=/listing/${listing.id}`);
      return;
    }
    if (!listing.seller.id) return; // static/demo listing has no real seller
    const convId = await openConversation(createClient(), listing.id, listing.seller.id, user.id);
    if (convId) router.push(`/chat/${convId}`);
  };

  return (
    <div className="wrap" style={{ padding: "26px 28px 90px" }}>
      <Link
        href="/browse"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          fontSize: 14,
          color: "var(--ink-soft)",
          marginBottom: 18,
        }}
      >
        <span style={{ transform: "rotate(180deg)" }}>
          <Icon name="arrow" size={16} sw={2} />
        </span>
        {t("ld.back")}
      </Link>

      <div
        className="eb-detail-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* gallery */}
        <div>
          <div
            className="card"
            style={{ overflow: "hidden", borderRadius: 20, position: "relative" }}
          >
            {listing.photoUrls.length ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.photoUrls[photo] ?? listing.photoUrls[0]}
                alt={listing.en}
                style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
              />
            ) : (
              <GeoThumb hue={listing.hue} seed={listing.photos[photo]} height={420} />
            )}
            <span style={{ position: "absolute", top: 14, left: 14 }}>
              <ConditionBadge condition={listing.condition} overlay />
            </span>
            <span
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                background: "rgba(33,27,22,0.78)",
                color: "var(--paper)",
                borderRadius: 999,
                padding: "4px 12px",
                fontSize: 12.5,
                fontFamily: "var(--mono)",
              }}
            >
              {photo + 1} / {(listing.photoUrls.length ? listing.photoUrls : listing.photos).length}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            {(listing.photoUrls.length ? listing.photoUrls : listing.photos).map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPhoto(i)}
                aria-label={`${t("ld.photo")} ${i + 1}`}
                aria-current={i === photo}
                style={{
                  width: 74,
                  height: 56,
                  borderRadius: 10,
                  overflow: "hidden",
                  padding: 0,
                  border: "2px solid",
                  borderColor: i === photo ? "var(--crimson)" : "transparent",
                  background: "none",
                }}
              >
                {typeof item === "string" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item}
                    alt=""
                    style={{ width: "100%", height: 56, objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <GeoThumb hue={listing.hue} seed={item} height={56} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* summary */}
        <div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontWeight: 800,
              color: "var(--crimson)",
              fontSize: "clamp(28px,3.4vw,38px)",
              lineHeight: 1,
            }}
          >
            {rs(listing.price, lang)}
          </div>
          <span
            className="badge"
            style={{
              background: "rgba(62,110,134,0.12)",
              color: "var(--steel)",
              marginTop: 12,
            }}
          >
            <Icon name="lock" size={13} sw={2.2} /> {t("ld.protected")}
          </span>

          <h1 style={{ fontSize: "clamp(22px,2.6vw,30px)", marginTop: 14 }}>
            {listing[lang]}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 10,
              color: "var(--ink-soft)",
              fontSize: 14.5,
            }}
          >
            <span>{listing.loc[lang]}</span>
            <span aria-hidden="true">·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon name="star" size={14} stroke="var(--gold)" /> {listing.rating.toFixed(1)}
            </span>
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
            <Link
              href={`/checkout/${listing.id}`}
              className="btn btn-primary"
              style={{ flex: "1 1 200px" }}
            >
              {t("ld.buy")} — {rs(listing.price, lang)}
            </Link>
            <button type="button" className="btn btn-ghost" onClick={messageSeller}>
              {t("ld.message")}
            </button>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Icon name="shield" size={15} sw={1.9} stroke="var(--green)" />
            {t("ld.guestNote")}
          </p>
          {/* seller card */}
          <div
            className="card"
            style={{ marginTop: 22, padding: "18px 18px", display: "flex", gap: 14, alignItems: "center" }}
          >
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 999,
                background: "var(--paper-3)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--display)",
                fontWeight: 800,
                fontSize: 18,
                flex: "0 0 auto",
              }}
            >
              {listing.seller.initial}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <strong style={{ fontFamily: "var(--display)", fontSize: 16 }}>
                  {listing.seller.name}
                </strong>
                {listing.seller.verified && (
                  <span className="badge badge-verified">
                    <Icon name="check" size={12} sw={2.8} /> {t("browse.verified")}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 3 }}>
                {listing.seller.sales} {t("ld.sales")} · {t("ld.memberSince")} {listing.seller.since}
              </div>
              <Link
                href={`/profile/${listing.seller.id || listing.seller.slug}`}
                style={{ fontSize: 13, color: "var(--crimson)", fontWeight: 600, marginTop: 4, display: "inline-block" }}
              >
                {t("ld.viewProfile")}
              </Link>
            </div>
            <TrustScore value={listing.seller.trust} size={48} />
          </div>
        </div>
      </div>

      {/* about + specs */}
      <div
        className="eb-detail-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 40,
          marginTop: 40,
          alignItems: "start",
        }}
      >
        <section>
          <h2 style={{ fontSize: 20 }}>{t("ld.about")}</h2>
          <p
            style={{
              color: "var(--ink-2)",
              marginTop: 12,
              fontSize: 15.5,
              lineHeight: 1.7,
            }}
          >
            {longDesc && !showFullDesc ? `${desc.slice(0, 180)}…` : desc}
          </p>
          {longDesc && (
            <button
              type="button"
              onClick={() => setShowFullDesc((v) => !v)}
              style={{
                marginTop: 8,
                background: "none",
                border: "none",
                color: "var(--crimson)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {showFullDesc ? t("ld.showLess") : t("ld.showMore")}
            </button>
          )}
        </section>

        <section>
          <h2 style={{ fontSize: 20 }}>{t("ld.specs")}</h2>
          <dl style={{ marginTop: 12 }}>
            {listing.specs.map((spec, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "11px 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <dt style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>
                  {spec.label[lang]}
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: 14.5,
                    textAlign: "right",
                  }}
                >
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <p style={{ marginTop: 26 }}>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "var(--ink-soft)",
            fontSize: 13,
            textDecoration: "underline",
          }}
        >
          {t("ld.report")}
        </button>
      </p>

      {/* related */}
      {related.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22 }}>{t("ld.related")}</h2>
          <div
            className="eb-listing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 22,
              marginTop: 20,
            }}
          >
            {related.map((it) => (
              <ListingCard key={it.id} it={it} condition={it.condition} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
