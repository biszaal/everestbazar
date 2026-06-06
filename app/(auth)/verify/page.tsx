"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { useAuthStore } from "@/store/authStore";
import { OTPInput } from "@/components/ui/OTPInput";

export default function VerifyPage() {
  const { t } = useT();
  const router = useRouter();
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const startLogin = useAuthStore((s) => s.startLogin);

  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [seconds, setSeconds] = useState(45);
  const [ready, setReady] = useState(false);

  // guard: no pending login → back to /login
  useEffect(() => {
    const tid = setTimeout(() => {
      if (!useAuthStore.getState().pendingPhone) router.replace("/login");
      else setReady(true);
    }, 0);
    return () => clearTimeout(tid);
  }, [router]);

  // resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const handleComplete = (value: string) => {
    const ok = verifyOtp(value);
    if (!ok) {
      setError(true);
      setTimeout(() => {
        setError(false);
        setCode("");
      }, 500);
      return;
    }
    const kyc = useAuthStore.getState().user?.kycStatus;
    const redirect = sessionStorage.getItem("eb-redirect");
    if (kyc === "VERIFIED") {
      sessionStorage.removeItem("eb-redirect");
      router.push(redirect || "/browse");
    } else {
      router.push("/kyc/upload");
    }
  };

  if (!ready && !pendingPhone) return null;

  return (
    <div className="card" style={{ padding: "34px 30px", borderRadius: 22 }}>
      <h1 style={{ fontSize: 26 }}>{t("au.otpTitle")}</h1>
      <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 15 }}>
        {t("au.otpSub")}{" "}
        <strong style={{ fontFamily: "var(--mono)", fontWeight: 600 }}>
          {pendingPhone}
        </strong>
      </p>

      <div style={{ marginTop: 24 }}>
        <OTPInput value={code} onChange={setCode} onComplete={handleComplete} error={error} />
      </div>

      {error && (
        <p
          role="alert"
          style={{
            color: "var(--crimson)",
            fontSize: 13,
            marginTop: 12,
            textAlign: "center",
          }}
        >
          {t("au.otpErr")}
        </p>
      )}

      <p
        style={{
          marginTop: 16,
          textAlign: "center",
          fontFamily: "var(--mono)",
          fontSize: 12.5,
          color: "var(--ink-soft)",
          letterSpacing: "0.04em",
        }}
      >
        {t("au.otpHint")}
      </p>

      <div style={{ marginTop: 18, textAlign: "center" }}>
        {seconds > 0 ? (
          <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>
            {t("au.resendIn")} {seconds}s
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (pendingPhone) startLogin(pendingPhone);
              setSeconds(45);
              setCode("");
            }}
          >
            {t("au.resend")}
          </button>
        )}
      </div>

      <div
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: "1px solid var(--line)",
          textAlign: "center",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/login")}
          style={{
            background: "none",
            border: "none",
            color: "var(--crimson)",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {t("au.changeNumber")}
        </button>
      </div>
    </div>
  );
}
