"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { OTPInput } from "@/components/ui/OTPInput";

export default function VerifyPage() {
  const { t } = useT();
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [seconds, setSeconds] = useState(45);

  // guard: must have an email from the login step
  useEffect(() => {
    const e = sessionStorage.getItem("eb-email");
    if (!e) router.replace("/login");
    else setEmail(e);
  }, [router]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const handleComplete = async (value: string) => {
    if (!email || verifying) return;
    setVerifying(true);
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: value,
      type: "email",
    });
    if (verifyError) {
      setVerifying(false);
      setError(true);
      setTimeout(() => {
        setError(false);
        setCode("");
      }, 500);
      return;
    }
    // session is set; pull the fresh profile, then route by KYC
    await useAuthStore.getState().refresh();
    sessionStorage.removeItem("eb-email");
    const kyc = useAuthStore.getState().user?.kycStatus;
    const redirect = sessionStorage.getItem("eb-redirect");
    if (kyc === "VERIFIED") {
      sessionStorage.removeItem("eb-redirect");
      router.push(redirect || "/browse");
    } else {
      router.push("/kyc/upload");
    }
  };

  const resend = async () => {
    if (!email) return;
    const supabase = createClient();
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setSeconds(45);
    setCode("");
  };

  if (!email) return null;

  return (
    <div className="card" style={{ padding: "34px 30px", borderRadius: 22 }}>
      <h1 style={{ fontSize: 26 }}>{t("au.otpTitle")}</h1>
      <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 15 }}>
        {t("au.otpSub")}{" "}
        <strong style={{ fontFamily: "var(--mono)", fontWeight: 600 }}>{email}</strong>
      </p>

      <div style={{ marginTop: 24 }}>
        <OTPInput
          value={code}
          onChange={setCode}
          onComplete={handleComplete}
          error={error}
          disabled={verifying}
          length={8}
        />
      </div>

      {error && (
        <p role="alert" style={{ color: "var(--crimson)", fontSize: 13, marginTop: 12, textAlign: "center" }}>
          {t("au.otpErr")}
        </p>
      )}

      <p
        style={{
          marginTop: 16,
          textAlign: "center",
          fontSize: 12.5,
          color: "var(--ink-soft)",
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
          <button type="button" className="btn btn-ghost btn-sm" onClick={resend}>
            {t("au.resend")}
          </button>
        )}
      </div>

      <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)", textAlign: "center" }}>
        <button
          type="button"
          onClick={() => router.push("/login")}
          style={{ background: "none", border: "none", color: "var(--crimson)", fontSize: 14, fontWeight: 600 }}
        >
          {t("au.changeNumber")}
        </button>
      </div>
    </div>
  );
}
