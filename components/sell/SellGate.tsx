"use client";

import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon, type IconName } from "@/components/brand/Icon";
import { useAuthHydrated, useUser } from "@/store/authStore";
import type { StringKey } from "@/lib/i18n";

interface Benefit {
  ic: IconName;
  t: StringKey;
  d: StringKey;
  tint: string;
}

const BENEFITS: Benefit[] = [
  { ic: "id", t: "how.s1t", d: "how.s1d", tint: "var(--crimson)" },
  { ic: "lock", t: "how.s2t", d: "how.s2d", tint: "var(--steel)" },
  { ic: "scales", t: "how.s3t", d: "how.s3d", tint: "var(--terracotta)" },
];

export function SellGate() {
  const { t } = useT();
  const hydrated = useAuthHydrated();
  const user = useUser();

  // figure out where "Start selling" should go + the helper line
  let href = "/listing/new";
  let cta: StringKey = "new.title";
  let helper: StringKey | null = null;

  if (hydrated && !user) {
    href = "/login?redirect=/listing/new";
    cta = "nav.login";
    helper = "sg.needLogin";
  } else if (hydrated && user && user.kycStatus !== "VERIFIED") {
    href = user.kycStatus === "PENDING" ? "/kyc/pending" : "/kyc/upload";
    cta = "sg.verifyNow";
    helper = "sg.needKyc";
  }

  return (
    <>
      {/* hero */}
      <div style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "56px 28px 50px", maxWidth: 820 }}>
          <span className="eyebrow">{t("sell.eyebrow")}</span>
          <h1 style={{ fontSize: "clamp(30px,5vw,52px)", marginTop: 16 }}>
            {t("sg.title")}
          </h1>
          <p
            style={{
              color: "var(--ink-2)",
              marginTop: 16,
              fontSize: 18,
              maxWidth: 560,
              lineHeight: 1.6,
            }}
          >
            {t("sell.sub")}
          </p>

          <div style={{ marginTop: 28 }}>
            <Link
              href={href}
              className="btn btn-primary"
              aria-disabled={!hydrated}
              style={{ pointerEvents: hydrated ? "auto" : "none", opacity: hydrated ? 1 : 0.6 }}
            >
              {t(cta)} <Icon name="arrow" size={18} sw={2.2} />
            </Link>
            {helper && (
              <p style={{ marginTop: 12, fontSize: 14, color: "var(--ink-soft)" }}>
                {t(helper)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* benefits */}
      <div className="wrap" style={{ padding: "56px 28px 80px" }}>
        <div
          className="eb-how-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 24,
          }}
        >
          {BENEFITS.map((b, i) => (
            <div key={i} className="card" style={{ padding: "28px 26px 30px" }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: `color-mix(in oklab, ${b.tint} 12%, var(--paper))`,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={b.ic} size={25} stroke={b.tint} />
              </div>
              <h3 style={{ fontSize: 20, marginTop: 18 }}>{t(b.t)}</h3>
              <p style={{ color: "var(--ink-2)", marginTop: 9, fontSize: 15, lineHeight: 1.6 }}>
                {t(b.d)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
