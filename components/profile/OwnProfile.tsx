"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { TrustScore } from "@/components/user/TrustScore";
import { EscrowStatus } from "@/components/checkout/EscrowStatus";
import { ReviewItem } from "@/components/user/Review";
import { useAuthStore, useAuthHydrated, useUser } from "@/store/authStore";
import { useTxnStore, useTxnHydrated } from "@/store/txnStore";
import { reviewsFor } from "@/lib/reviews";
import type { StringKey } from "@/lib/i18n";

type Tab = "listings" | "purchases" | "sales" | "reviews";

export function OwnProfile() {
  const { t } = useT();
  const authHydrated = useAuthHydrated();
  const txnHydrated = useTxnHydrated();
  const user = useUser();
  const setName = useAuthStore((s) => s.setName);
  const txns = useTxnStore((s) => s.txns);

  const [tab, setTab] = useState<Tab>("listings");
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  if (!authHydrated) return null;

  if (!user) {
    return (
      <div className="wrap" style={{ padding: "70px 28px", maxWidth: 440, textAlign: "center" }}>
        <div className="card" style={{ padding: "36px 30px", borderRadius: 22 }}>
          <Icon name="id" size={40} stroke="var(--crimson)" />
          <h1 style={{ fontSize: 22, marginTop: 14 }}>{t("pf.loginNeeded")}</h1>
          <Link href="/login?redirect=/profile" className="btn btn-primary" style={{ marginTop: 20 }}>
            {t("nav.login")}
          </Link>
        </div>
      </div>
    );
  }

  const sales = txns.filter((tx) => tx.role === "seller" && tx.status === "COMPLETED").length;
  const purchases = txns.filter((tx) => tx.role === "buyer" && tx.status === "COMPLETED").length;
  const verified = user.kycStatus === "VERIFIED";
  const trust = Math.min(100, Math.round(sales * 8 + purchases * 4 + 4.8 * 12 + (verified ? 30 : 0)));
  const maskedPhone = `+977 ••••${user.phone.slice(-4)}`;

  const buyerTxns = txns.filter((tx) => tx.role === "buyer");
  const sellerTxns = txns.filter((tx) => tx.role === "seller");
  const reviews = reviewsFor(user.phone.length, 3);

  const tabs: { key: Tab; label: StringKey }[] = [
    { key: "listings", label: "pf.tabListings" },
    { key: "purchases", label: "pf.tabPurchases" },
    { key: "sales", label: "pf.tabSales" },
    { key: "reviews", label: "pf.tabReviews" },
  ];

  return (
    <div className="wrap" style={{ padding: "30px 28px 90px", maxWidth: 820 }}>
      {/* KYC banner */}
      {!verified && <KycBanner status={user.kycStatus} />}

      {/* profile card */}
      <div
        className="card"
        style={{ padding: "22px 24px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}
      >
        <span
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: "var(--crimson)",
            color: "var(--paper)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--display)",
            fontWeight: 800,
            fontSize: 26,
            flex: "0 0 auto",
          }}
        >
          {(user.name.trim()[0] ?? user.phone.slice(-1)).toUpperCase()}
        </span>
        <div style={{ flex: 1, minWidth: 200 }}>
          {editing ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="eb-input"
                style={{ maxWidth: 220 }}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setName(nameDraft.trim());
                  setEditing(false);
                }}
              >
                {t("pf.save")}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 24 }}>{user.name || t("nav.account")}</h1>
              <button
                type="button"
                onClick={() => {
                  setNameDraft(user.name);
                  setEditing(true);
                }}
                aria-label="Edit name"
                style={{ background: "none", border: "none", color: "var(--ink-soft)" }}
              >
                <Icon name="id" size={17} />
              </button>
            </div>
          )}
          <div style={{ fontSize: 13.5, color: "var(--ink-soft)", fontFamily: "var(--mono)", marginTop: 4 }}>
            {maskedPhone}
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 8 }}>
            {sales} {t("pf.statSales")} · {purchases} {t("pf.statPurchases")} · 4.8 {t("pf.statRating")}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <TrustScore value={trust} size={60} />
          {verified && (
            <div style={{ marginTop: 6 }}>
              <span className="badge badge-verified">
                <Icon name="check" size={11} sw={2.8} /> {t("browse.verified")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginTop: 24,
          borderBottom: "1px solid var(--line)",
          overflowX: "auto",
        }}
      >
        {tabs.map(({ key, label }) => {
          const on = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              style={{
                background: "none",
                border: "none",
                padding: "12px 14px",
                fontSize: 15,
                fontWeight: on ? 700 : 500,
                fontFamily: "var(--display)",
                color: on ? "var(--ink)" : "var(--ink-soft)",
                borderBottom: "2px solid",
                borderColor: on ? "var(--crimson)" : "transparent",
                whiteSpace: "nowrap",
              }}
            >
              {t(label)}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 24 }}>
        {tab === "listings" && (
          <div style={{ textAlign: "center", padding: "44px 0" }}>
            <p style={{ color: "var(--ink-soft)", fontSize: 16 }}>{t("pf.noListings")}</p>
            <Link href="/listing/new" className="btn btn-primary" style={{ marginTop: 16 }}>
              {t("pf.newListing")} <Icon name="arrow" size={18} sw={2.2} />
            </Link>
          </div>
        )}

        {tab === "purchases" && (
          <TxnList list={txnHydrated ? buyerTxns : []} empty={t("dash.empty")} />
        )}
        {tab === "sales" && (
          <TxnList list={txnHydrated ? sellerTxns : []} empty={t("dash.empty")} />
        )}

        {tab === "reviews" && (
          <div>
            {reviews.length === 0 ? (
              <p style={{ color: "var(--ink-soft)", textAlign: "center", padding: "40px 0" }}>
                {t("pf.noReviews")}
              </p>
            ) : (
              reviews.map((r, i) => <ReviewItem key={i} review={r} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TxnList({ list, empty }: { list: ReturnType<typeof useTxnStore.getState>["txns"]; empty: string }) {
  if (list.length === 0)
    return <p style={{ color: "var(--ink-soft)", textAlign: "center", padding: "40px 0" }}>{empty}</p>;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {list.map((tx) => (
        <EscrowStatus key={tx.id} txn={tx} />
      ))}
    </div>
  );
}

function KycBanner({ status }: { status: string }) {
  const { t } = useT();
  const map: Record<string, { msg: StringKey; bg: string; color: string; cta?: StringKey; href?: string }> = {
    NONE: { msg: "pf.bannerNone", bg: "color-mix(in oklab, var(--gold) 14%, var(--paper))", color: "var(--terracotta)", cta: "sg.verifyNow", href: "/kyc/upload" },
    PENDING: { msg: "pf.bannerPending", bg: "color-mix(in oklab, var(--steel) 12%, var(--paper))", color: "var(--steel)" },
    REJECTED: { msg: "pf.bannerRejected", bg: "color-mix(in oklab, var(--crimson) 10%, var(--paper))", color: "var(--crimson)", cta: "sg.verifyNow", href: "/kyc/upload" },
  };
  const cfg = map[status] ?? map.NONE;
  return (
    <div
      style={{
        background: cfg.bg,
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "14px 18px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <Icon name="shield" size={20} sw={1.9} stroke={cfg.color} />
      <span style={{ flex: 1, fontSize: 14.5, color: "var(--ink-2)", minWidth: 200 }}>{t(cfg.msg)}</span>
      {cfg.cta && cfg.href && (
        <Link href={cfg.href} className="btn btn-sm" style={{ background: cfg.color, color: "var(--paper)" }}>
          {t(cfg.cta)}
        </Link>
      )}
    </div>
  );
}
