"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { useAuthStore, useAuthHydrated, useUser } from "@/store/authStore";
import { Icon } from "@/components/brand/Icon";

export default function KycPendingPage() {
  const { t } = useT();
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useUser();
  const approveKyc = useAuthStore((s) => s.approveKyc);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/login?redirect=/sell");
    else if (user.kycStatus === "NONE") router.replace("/kyc/upload");
  }, [hydrated, user, router]);

  if (!hydrated || !user) return null;

  const verified = user.kycStatus === "VERIFIED";

  const approve = () => {
    setApproving(true);
    // simulate review latency, then approve and continue
    setTimeout(() => {
      approveKyc();
      const redirect = sessionStorage.getItem("eb-redirect");
      sessionStorage.removeItem("eb-redirect");
      router.push(redirect || "/listing/new");
    }, 900);
  };

  return (
    <div className="card" style={{ padding: "38px 30px", borderRadius: 22, textAlign: "center" }}>
      <div
        className="eb-pop"
        style={{
          width: 84,
          height: 84,
          borderRadius: 999,
          margin: "0 auto 22px",
          display: "grid",
          placeItems: "center",
          background: verified
            ? "color-mix(in oklab, var(--green) 16%, var(--paper))"
            : "color-mix(in oklab, var(--gold) 18%, var(--paper))",
        }}
      >
        {verified ? (
          <Icon name="check" size={44} sw={2.4} stroke="var(--green)" />
        ) : (
          <Icon name="shield" size={42} sw={1.9} stroke="var(--gold)" />
        )}
      </div>

      <h1 style={{ fontSize: 25 }}>
        {verified ? t("sell.successT") : t("kyc.pendingTitle")}
      </h1>
      <p
        style={{
          color: "var(--ink-2)",
          marginTop: 12,
          fontSize: 15.5,
          maxWidth: 360,
          marginInline: "auto",
        }}
      >
        {verified ? t("sell.successD") : t("kyc.pendingBody")}
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 26 }}>
        {verified ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.push("/listing/new")}
          >
            {t("sell.listNow")} <Icon name="arrow" size={18} sw={2.2} />
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={approve}
              disabled={approving}
            >
              {approving ? (
                <Spinner />
              ) : (
                <>
                  {t("kyc.demoApprove")} <Icon name="check" size={18} sw={2.4} />
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => router.push("/browse")}
            >
              {t("kyc.goBrowse")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="eb-spin"
      style={{
        width: 18,
        height: 18,
        borderRadius: 999,
        border: "2px solid rgba(246,240,230,0.4)",
        borderTopColor: "var(--paper)",
        display: "inline-block",
      }}
    />
  );
}
