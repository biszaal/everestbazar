"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { EscrowStatus } from "@/components/checkout/EscrowStatus";
import { Icon } from "@/components/brand/Icon";
import { useUser, useAuthHydrated } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { getMyTransactions, type MyTxn } from "@/lib/data";
import { sellerPayout } from "@/lib/types";
import { rs } from "@/lib/format";
import type { StringKey } from "@/lib/i18n";
import type { TxnStatus } from "@/lib/types";

type Filter = "all" | "pending" | "completed" | "disputed";

export function TxnDashboard({ role }: { role: "buyer" | "seller" }) {
  const { t, lang } = useT();
  const authHydrated = useAuthHydrated();
  const user = useUser();
  const [txns, setTxns] = useState<MyTxn[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(() => {
    if (!user) return;
    setLoading(true);
    getMyTransactions(createClient(), user.id)
      .then(setTxns)
      .catch(() => setTxns([]))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (authHydrated && user) load();
    else if (authHydrated && !user) setLoading(false);
  }, [authHydrated, user, load]);

  if (authHydrated && !user) {
    return (
      <div className="wrap" style={{ padding: "70px 28px", maxWidth: 440, textAlign: "center" }}>
        <div className="card" style={{ padding: "36px 30px", borderRadius: 22 }}>
          <Icon name="lock" size={36} stroke="var(--crimson)" />
          <h1 style={{ fontSize: 22, marginTop: 14 }}>{t("pf.loginNeeded")}</h1>
          <Link href={`/login?redirect=/${role === "buyer" ? "purchases" : "sales"}`} className="btn btn-primary" style={{ marginTop: 18 }}>
            {t("nav.login")}
          </Link>
        </div>
      </div>
    );
  }

  const mine = txns.filter((tx) => tx.role === role);
  const earnings = mine
    .filter((tx) => tx.status === "COMPLETED")
    .reduce((sum, tx) => sum + sellerPayout(tx.priceNPR), 0);

  const matches = (status: TxnStatus): Filter[] => {
    if (status === "ESCROW_HELD" || status === "PENDING_PAYMENT") return ["all", "pending"];
    if (status === "COMPLETED") return ["all", "completed"];
    if (status === "DISPUTED") return ["all", "disputed"];
    return ["all"];
  };
  const list = mine.filter((tx) => matches(tx.status).includes(filter));

  const filters: { key: Filter; label: StringKey }[] = [
    { key: "all", label: "dash.all" },
    { key: "pending", label: "dash.pending" },
    { key: "completed", label: "dash.completed" },
    ...(role === "buyer" ? [{ key: "disputed" as Filter, label: "dash.disputed" as StringKey }] : []),
  ];

  return (
    <div className="wrap" style={{ padding: "34px 28px 90px", maxWidth: 760 }}>
      <h1 style={{ fontSize: "clamp(26px,3.4vw,38px)" }}>
        {t(role === "buyer" ? "dash.purchases" : "dash.sales")}
      </h1>
      <p style={{ color: "var(--ink-2)", marginTop: 10, fontSize: 16 }}>
        {t(role === "buyer" ? "dash.purchasesSub" : "dash.salesSub")}
      </p>

      {role === "seller" && !loading && (
        <div
          className="card"
          style={{
            marginTop: 20,
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--ink)",
            color: "var(--paper)",
          }}
        >
          <span style={{ fontSize: 14.5, color: "rgba(246,240,230,0.75)" }}>{t("dash.earnings")}</span>
          <strong style={{ fontFamily: "var(--display)", fontSize: 24, color: "var(--gold)" }}>
            {rs(earnings, lang)}
          </strong>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "22px 0 20px" }}>
        {filters.map(({ key, label }) => {
          const on = filter === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(key)}
              style={{
                border: "1px solid",
                borderColor: on ? "var(--ink)" : "var(--line-2)",
                background: on ? "var(--ink)" : "transparent",
                color: on ? "var(--paper)" : "var(--ink-2)",
                padding: "8px 16px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {t(label)}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: "grid", gap: 14 }}>
          {[0, 1].map((i) => (
            <div key={i} className="card" style={{ height: 120, background: "var(--paper-2)", border: "1px solid var(--line)" }} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "var(--ink-soft)", fontSize: 16 }}>{t("dash.empty")}</p>
          <Link href="/browse" className="btn btn-ghost" style={{ marginTop: 16 }}>
            {t("dash.startBrowsing")} <Icon name="arrow" size={18} sw={2.2} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {list.map((tx) => (
            <EscrowStatus key={tx.id} txn={tx} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}
