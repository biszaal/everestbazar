"use client";

import Link from "next/link";
import { AppFrame } from "@/components/layout/AppFrame";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";

export default function CheckoutFailedPage() {
  const { t } = useT();
  return (
    <AppFrame>
      <div className="wrap" style={{ padding: "60px 28px 90px", maxWidth: 560 }}>
        <div className="card" style={{ padding: "44px 32px", textAlign: "center", borderRadius: 22 }}>
          <div
            className="eb-pop"
            style={{
              width: 90,
              height: 90,
              borderRadius: 999,
              margin: "0 auto 24px",
              display: "grid",
              placeItems: "center",
              background: "color-mix(in oklab, var(--crimson) 12%, var(--paper))",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--crimson)" strokeWidth="2.4" strokeLinecap="round">
              <path d="M7 7l10 10M17 7L7 17" />
            </svg>
          </div>
          <h1 style={{ fontSize: 26 }}>{t("cf.title")}</h1>
          <p style={{ color: "var(--ink-2)", marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
            {t("cf.body")}
          </p>
          <div style={{ display: "grid", gap: 10, marginTop: 28 }}>
            <Link href="/browse" className="btn btn-primary">
              {t("cf.retry")} <Icon name="arrow" size={18} sw={2.2} />
            </Link>
            <a href="mailto:support@everestbazar.com" className="btn btn-ghost">
              {t("cf.support")}
            </a>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
