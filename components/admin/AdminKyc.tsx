"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { useAuthHydrated, useUser } from "@/store/authStore";
import { isAdmin, PENDING_KYC, type KycApplication } from "@/lib/admin";
import { formatRelative } from "@/lib/format";
import type { StringKey } from "@/lib/i18n";

export function AdminKyc() {
  const { t, lang } = useT();
  const hydrated = useAuthHydrated();
  const user = useUser();
  const [apps, setApps] = useState<KycApplication[]>(PENDING_KYC);
  const [notice, setNotice] = useState("");

  if (!hydrated) return null;

  if (!isAdmin(user?.phone)) {
    return (
      <div className="wrap" style={{ padding: "70px 28px", maxWidth: 440, textAlign: "center" }}>
        <div className="card" style={{ padding: "36px 30px", borderRadius: 22 }}>
          <Icon name="lock" size={38} stroke="var(--crimson)" />
          <h1 style={{ fontSize: 22, marginTop: 14 }}>{t("ad.denied")}</h1>
          <Link href="/login?redirect=/admin/kyc" className="btn btn-primary" style={{ marginTop: 20 }}>
            {t("nav.login")}
          </Link>
        </div>
      </div>
    );
  }

  const act = (id: string, kind: "approve" | "reject") => {
    setApps((list) => list.filter((a) => a.id !== id));
    setNotice(`${kind === "approve" ? t("ad.approved") : t("ad.rejected")} · ${t("ad.notify")}`);
    setTimeout(() => setNotice(""), 3500);
  };

  return (
    <div className="wrap" style={{ padding: "34px 28px 90px", maxWidth: 820 }}>
      <span className="eyebrow">{t("nav.adminKyc")}</span>
      <h1 style={{ fontSize: "clamp(26px,3.4vw,38px)", marginTop: 12 }}>{t("ad.title")}</h1>
      <p style={{ color: "var(--ink-2)", marginTop: 10, fontSize: 16 }}>{t("ad.sub")}</p>

      {notice && (
        <div
          role="status"
          style={{
            marginTop: 18,
            background: "color-mix(in oklab, var(--green) 12%, var(--paper))",
            border: "1px solid color-mix(in oklab, var(--green) 30%, var(--paper))",
            borderRadius: 12,
            padding: "12px 16px",
            fontSize: 14,
            color: "var(--green)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon name="check" size={16} sw={2.6} stroke="var(--green)" /> {notice}
        </div>
      )}

      {apps.length === 0 ? (
        <p style={{ color: "var(--ink-soft)", textAlign: "center", padding: "60px 0" }}>
          {t("ad.none")}
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16, marginTop: 22 }}>
          {apps.map((a) => (
            <ApplicationCard key={a.id} app={a} lang={lang} t={t} onAct={act} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({
  app,
  lang,
  t,
  onAct,
}: {
  app: KycApplication;
  lang: "en" | "ne";
  t: (k: StringKey) => string;
  onAct: (id: string, kind: "approve" | "reject") => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "var(--paper-3)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--display)",
            fontWeight: 800,
            flex: "0 0 auto",
          }}
        >
          {app.name[0]}
        </span>
        <div style={{ flex: 1, minWidth: 160 }}>
          <strong style={{ fontFamily: "var(--display)", fontSize: 16 }}>{app.name}</strong>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", fontFamily: "var(--mono)" }}>
            {app.phone}
          </div>
        </div>
        <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
          {t("ad.submitted")} {formatRelative(app.submittedAt, lang)}
        </span>
      </div>

      {/* document placeholders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
        {([["ad.nidFront", 28], ["ad.nidBack", 50], ["ad.selfie", 86]] as [StringKey, number][]).map(
          ([label, hue]) => (
            <div
              key={label}
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--line)",
                background: `oklch(0.92 0.03 ${hue})`,
                height: 84,
                display: "grid",
                placeItems: "center",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  fontFamily: "var(--mono)",
                  color: "var(--ink-soft)",
                  padding: "0 6px",
                }}
              >
                {t(label)}
              </span>
            </div>
          )
        )}
      </div>

      {rejecting ? (
        <div style={{ marginTop: 14 }}>
          <input
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("ad.rejectReason")}
            className="eb-input"
          />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRejecting(false)}>
              {t("dp.back")}
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => onAct(app.id, "reject")}
              style={{ background: "var(--crimson)", color: "var(--paper)", flex: 1 }}
            >
              {t("ad.reject")}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => onAct(app.id, "approve")}
            style={{ background: "var(--green)", color: "var(--paper)", flex: 1 }}
          >
            {t("ad.approve")} <Icon name="check" size={16} sw={2.4} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setRejecting(true)}
            style={{ color: "var(--crimson)", boxShadow: "inset 0 0 0 1.5px var(--crimson)" }}
          >
            {t("ad.reject")}
          </button>
        </div>
      )}
    </div>
  );
}
