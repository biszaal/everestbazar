"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon, type IconName } from "@/components/brand/Icon";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { ConditionBadge } from "@/components/listing/ConditionBadge";
import { useUser, useAuthHydrated } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { rs } from "@/lib/format";
import { buyerTotal, ESCROW_FEE_NPR, type PaymentMethod } from "@/lib/types";
import type { UiListing } from "@/lib/adapters";
import type { StringKey } from "@/lib/i18n";

const ESCROW_STEPS: { ic: IconName; k: StringKey }[] = [
  { ic: "coin", k: "co.p1" },
  { ic: "box", k: "co.p2" },
  { ic: "check", k: "co.p3" },
  { ic: "scales", k: "co.p4" },
];

export function CheckoutClient({ listing }: { listing: UiListing }) {
  const { t, lang } = useT();
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useUser();

  const [pay, setPay] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [payError, setPayError] = useState(false);

  const total = buyerTotal(listing.price);
  const verified = user?.kycStatus === "VERIFIED";

  // require login to buy
  useEffect(() => {
    if (hydrated && !user) router.replace(`/login?redirect=/checkout/${listing.id}`);
  }, [hydrated, user, router, listing.id]);

  const confirm = async () => {
    if (!pay) {
      setPayError(true);
      return;
    }
    setProcessing(true);
    setError("");
    // server computes fees + reserves the listing (create_transaction RPC)
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("create_transaction", {
      p_listing_id: listing.id,
      p_payment: pay,
    });
    if (rpcError) {
      setProcessing(false);
      setError(rpcError.message);
      return;
    }
    // real flow redirects to the eSewa/Khalti gateway here; demo → success
    router.push(`/checkout/success?id=${listing.id}`);
  };

  if (!hydrated || !user) return null; // redirecting to /login

  if (!verified) {
    return (
      <div className="wrap" style={{ padding: "60px 28px", maxWidth: 480, textAlign: "center" }}>
        <div className="card" style={{ padding: "32px 28px", borderRadius: 22 }}>
          <Icon name="shield" size={38} stroke="var(--crimson)" />
          <h1 style={{ fontSize: 22, marginTop: 14 }}>{t("sg.needKyc")}</h1>
          <Link href="/kyc/upload" className="btn btn-primary" style={{ marginTop: 18 }}>
            {t("sg.verifyNow")} <Icon name="arrow" size={18} sw={2.2} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: "26px 28px 90px" }}>
      <h1
        style={{
          fontSize: "clamp(24px,3vw,32px)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Icon name="lock" size={26} sw={2} stroke="var(--steel)" />
        {t("co.title")}
      </h1>

      <div
        className="eb-checkout-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 32,
          marginTop: 26,
          alignItems: "start",
        }}
      >
        {/* left: details */}
        <div style={{ display: "grid", gap: 22 }}>
          {/* item */}
          <section className="card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", flex: "0 0 auto" }}>
              {listing.photoUrls[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={listing.photoUrls[0]} alt={listing.en} style={{ width: 72, height: 72, objectFit: "cover", display: "block" }} />
              ) : (
                <GeoThumb hue={listing.hue} seed={listing.seed} height={72} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ fontFamily: "var(--display)", fontSize: 16 }}>
                {listing[lang]}
              </strong>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                <ConditionBadge condition={listing.condition} />
                <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                  {listing.seller.name}
                </span>
              </div>
            </div>
            <span
              style={{
                fontFamily: "var(--display)",
                fontWeight: 800,
                color: "var(--crimson)",
                fontSize: 18,
                whiteSpace: "nowrap",
              }}
            >
              {rs(listing.price, lang)}
            </span>
          </section>

          {/* escrow explainer */}
          <details open className="card" style={{ padding: "18px 20px" }}>
            <summary
              style={{
                cursor: "pointer",
                fontFamily: "var(--display)",
                fontWeight: 700,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                gap: 9,
                listStyle: "none",
              }}
            >
              <Icon name="lock" size={18} sw={2} stroke="var(--steel)" />
              {t("co.howProtected")}
            </summary>
            <ol style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "grid", gap: 12 }}>
              {ESCROW_STEPS.map((s, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "var(--ink)",
                      color: "var(--gold)",
                      display: "grid",
                      placeItems: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    <Icon name={s.ic} size={16} sw={2} />
                  </span>
                  <span style={{ fontSize: 14.5, color: "var(--ink-2)", paddingTop: 4 }}>
                    {t(s.k)}
                  </span>
                </li>
              ))}
            </ol>
          </details>

          {/* contact */}
          <section className="card" style={{ padding: "18px 20px" }}>
            <h2 style={{ fontSize: 17 }}>{t("co.contact")}</h2>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>
              {t("co.contactNote")}
            </p>
            <p style={{ fontSize: 14, marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="check" size={15} sw={2.6} stroke="var(--green)" />
              {t("co.signedInAs")}{" "}
              <strong style={{ fontFamily: "var(--mono)" }}>{user.email}</strong>
            </p>
          </section>

          {/* delivery */}
          <section className="card" style={{ padding: "18px 20px" }}>
            <h2 style={{ fontSize: 17 }}>{t("co.delivery")}</h2>
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <RadioRow selected title={t("co.meet")} note={t("co.meetNote")} />
              <RadioRow disabled title={t("co.pathao")} badge={t("co.soon")} />
            </div>
          </section>

          {/* payment */}
          <section className="card" style={{ padding: "18px 20px" }}>
            <h2 style={{ fontSize: 17 }}>{t("co.payment")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <PayCard
                name="eSewa"
                color="#60bb46"
                selected={pay === "ESEWA"}
                onClick={() => setPay("ESEWA")}
              />
              <PayCard
                name="Khalti"
                color="#5c2d91"
                selected={pay === "KHALTI"}
                onClick={() => setPay("KHALTI")}
              />
            </div>
            {payError && <ErrText>{t("co.payment")}</ErrText>}
          </section>
        </div>

        {/* right: summary */}
        <aside className="card eb-checkout-summary" style={{ padding: "22px 22px" }}>
          <Row label={t("co.itemPrice")} value={rs(listing.price, lang)} />
          <Row label={t("co.escrowFee")} value={rs(ESCROW_FEE_NPR, lang)} />
          <div style={{ height: 1, background: "var(--line)", margin: "12px 0" }} />
          <Row label={t("co.total")} value={rs(total, lang)} strong />
          <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 10 }}>
            {t("co.sellerFeeNote")}
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={confirm}
            disabled={processing}
            style={{ width: "100%", marginTop: 18 }}
          >
            {processing ? (
              <>
                <Spinner /> {t("co.processing")}
              </>
            ) : (
              <>
                {t("co.pay")} · {rs(total, lang)}
              </>
            )}
          </button>
          <p
            style={{
              fontSize: 12.5,
              color: "var(--ink-soft)",
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 7,
              justifyContent: "center",
            }}
          >
            <Icon name="lock" size={14} sw={2} stroke="var(--steel)" />
            {t("co.payNote")}
          </p>
          {error && (
            <p role="alert" style={{ color: "var(--crimson)", fontSize: 12.5, marginTop: 10, textAlign: "center" }}>
              {error}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function ErrText({ children }: { children: React.ReactNode }) {
  return (
    <span role="alert" style={{ display: "block", color: "var(--crimson)", fontSize: 12.5, marginTop: 6 }}>
      {children}
    </span>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "4px 0" }}>
      <span style={{ color: "var(--ink-2)", fontSize: 14.5 }}>{label}</span>
      <span
        style={{
          fontWeight: strong ? 800 : 600,
          fontSize: strong ? 18 : 14.5,
          fontFamily: strong ? "var(--display)" : "inherit",
          color: strong ? "var(--crimson)" : "var(--ink)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function RadioRow({
  title,
  note,
  badge,
  selected,
  disabled,
}: {
  title: string;
  note?: string;
  badge?: string;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 12,
        border: "1.5px solid",
        borderColor: selected ? "var(--crimson)" : "var(--line-2)",
        background: selected ? "color-mix(in oklab, var(--crimson) 5%, var(--paper))" : "var(--paper)",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          border: "2px solid",
          borderColor: selected ? "var(--crimson)" : "var(--line-2)",
          display: "grid",
          placeItems: "center",
          flex: "0 0 auto",
        }}
      >
        {selected && (
          <span style={{ width: 9, height: 9, borderRadius: 999, background: "var(--crimson)" }} />
        )}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14.5 }}>{title}</div>
        {note && <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{note}</div>}
      </div>
      {badge && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--ink-soft)",
            background: "var(--paper-2)",
            border: "1px solid var(--line)",
            padding: "3px 8px",
            borderRadius: 999,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function PayCard({
  name,
  color,
  selected,
  onClick,
}: {
  name: string;
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 14px",
        borderRadius: 12,
        border: "1.5px solid",
        borderColor: selected ? "var(--crimson)" : "var(--line-2)",
        background: selected ? "color-mix(in oklab, var(--crimson) 5%, var(--paper))" : "var(--paper)",
        transition: "all .15s",
      }}
    >
      <span style={{ width: 12, height: 12, borderRadius: 4, background: color, flex: "0 0 auto" }} />
      <span style={{ fontWeight: 700, fontFamily: "var(--display)", fontSize: 15 }}>{name}</span>
    </button>
  );
}

function Spinner() {
  return (
    <span
      className="eb-spin"
      style={{
        width: 16,
        height: 16,
        borderRadius: 999,
        border: "2px solid rgba(246,240,230,0.4)",
        borderTopColor: "var(--paper)",
        display: "inline-block",
      }}
    />
  );
}
