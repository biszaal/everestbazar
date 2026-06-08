"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { rs } from "@/lib/format";
import { toSeed } from "@/lib/adapters";
import { sellerPayout } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import type { MyTxn } from "@/lib/data";

function hoursLeft(iso: string | null): number {
  if (!iso) return 0;
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 3_600_000));
}

const STATUS_TINT: Record<string, { bg: string; color: string }> = {
  PENDING_PAYMENT: { bg: "rgba(201,150,47,0.14)", color: "var(--gold)" },
  ESCROW_HELD: { bg: "rgba(62,110,134,0.12)", color: "var(--steel)" },
  COMPLETED: { bg: "rgba(63,125,82,0.12)", color: "var(--green)" },
  DISPUTED: { bg: "rgba(192,105,46,0.14)", color: "var(--terracotta)" },
};

export function EscrowStatus({ txn, onChanged }: { txn: MyTxn; onChanged?: () => void }) {
  const { t, lang } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isBuyer = txn.role === "buyer";
  const tint = STATUS_TINT[txn.status] ?? STATUS_TINT.ESCROW_HELD;
  const filled = txn.status === "COMPLETED" ? 3 : txn.status === "ESCROW_HELD" ? 1 : 0;

  const statusLabel =
    txn.status === "COMPLETED"
      ? t("es.completed")
      : txn.status === "DISPUTED"
        ? t("dash.disputed")
        : txn.status === "PENDING_PAYMENT"
          ? t("dash.pending")
          : t("es.paid");

  const confirm = async () => {
    setBusy(true);
    setError("");
    const { error: rpcError } = await createClient().rpc("confirm_delivery", { p_txn_id: txn.id });
    setBusy(false);
    if (rpcError) setError(rpcError.message);
    else onChanged?.();
  };

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <Link
          href={`/listing/${txn.listingId}`}
          style={{ width: 64, height: 64, borderRadius: 12, overflow: "hidden", flex: "0 0 auto" }}
        >
          {txn.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={txn.coverUrl} alt="" style={{ width: 64, height: 64, objectFit: "cover", display: "block" }} />
          ) : (
            <GeoThumb hue={txn.hue} seed={toSeed(txn.listingId)} height={64} />
          )}
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/listing/${txn.listingId}`}>
            <strong style={{ fontFamily: "var(--display)", fontSize: 15.5 }}>
              {lang === "ne" ? txn.titleNe : txn.titleEn}
            </strong>
          </Link>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 3 }}>
            {t("es.with")} {txn.counterpart} · {t("es.order")} {txn.id.slice(0, 4).toUpperCase()}
          </div>
        </div>
        <div style={{ textAlign: "right", flex: "0 0 auto" }}>
          <div style={{ fontFamily: "var(--display)", fontWeight: 800, color: "var(--crimson)", fontSize: 16 }}>
            {rs(txn.priceNPR, lang)}
          </div>
          <span className="badge" style={{ background: tint.bg, color: tint.color, marginTop: 4 }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* timeline */}
      {txn.status !== "DISPUTED" && txn.status !== "PENDING_PAYMENT" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
          {[t("es.paid"), t("es.delivered"), t("es.completed")].map((label, i) => {
            const on = i < filled;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "0 0 auto" }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    background: on ? "var(--crimson)" : "var(--paper-3)",
                    color: on ? "var(--paper)" : "var(--ink-soft)",
                    flex: "0 0 auto",
                  }}
                >
                  {on ? <Icon name="check" size={12} sw={3} /> : <span style={{ fontSize: 11 }}>{i + 1}</span>}
                </span>
                <span style={{ fontSize: 11.5, color: "var(--ink-soft)", margin: "0 6px", whiteSpace: "nowrap" }}>
                  {label}
                </span>
                {i < 2 && (
                  <span style={{ flex: 1, height: 2, background: i + 1 < filled ? "var(--crimson)" : "var(--paper-3)" }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* actions / status text */}
      <div style={{ marginTop: 14 }}>
        {isBuyer && txn.status === "ESCROW_HELD" && (
          <>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
              <Icon name="lock" size={14} sw={2} stroke="var(--steel)" />
              {hoursLeft(txn.escrowDeadline)}h {t("es.timeleft")}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={confirm} disabled={busy}>
                {t("es.confirm")} <Icon name="check" size={16} sw={2.4} />
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => router.push(`/dispute/${txn.id}`)}
                style={{ background: "transparent", color: "var(--crimson)", boxShadow: "inset 0 0 0 1.5px var(--crimson)" }}
              >
                {t("es.dispute")}
              </button>
            </div>
          </>
        )}

        {isBuyer && txn.status === "PENDING_PAYMENT" && (
          <span className="badge" style={{ background: tint.bg, color: tint.color }}>{t("dash.pending")}</span>
        )}

        {isBuyer && txn.status === "COMPLETED" && (
          <span className="badge badge-verified">
            <Icon name="check" size={12} sw={2.8} /> {t("es.completed")}
          </span>
        )}

        {isBuyer && txn.status === "DISPUTED" && (
          <span className="badge" style={{ background: tint.bg, color: tint.color }}>{t("es.underReview")}</span>
        )}

        {!isBuyer && txn.status === "ESCROW_HELD" && (
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{t("es.awaiting")}</p>
        )}

        {!isBuyer && txn.status === "COMPLETED" && (
          <div style={{ fontSize: 14 }}>
            {t("es.payout")}:{" "}
            <strong style={{ color: "var(--green)", fontFamily: "var(--display)" }}>
              {rs(sellerPayout(txn.priceNPR), lang)}
            </strong>
          </div>
        )}

        {error && (
          <p role="alert" style={{ color: "var(--crimson)", fontSize: 12.5, marginTop: 8 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
