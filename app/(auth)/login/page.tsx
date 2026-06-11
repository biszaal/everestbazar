"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/brand/Icon";

export default function LoginPage() {
  const { t } = useT();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // remember where to return after auth (e.g. /listing/new, /checkout/[id])
  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    if (redirect) sessionStorage.setItem("eb-redirect", redirect);
  }, []);

  const submit = async () => {
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(t("au.errEmail"));
      return;
    }
    setError("");
    setSending(true);
    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: value,
      options: { shouldCreateUser: true },
    });
    setSending(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    sessionStorage.setItem("eb-email", value);
    router.push("/verify");
  };

  return (
    <div className="card" style={{ padding: "34px 30px", borderRadius: 22 }}>
      <span className="eyebrow">{t("au.eyebrow")}</span>
      <h1 style={{ fontSize: 28, marginTop: 14 }}>{t("au.welcome")}</h1>
      <p style={{ color: "var(--ink-2)", marginTop: 10, fontSize: 15.5 }}>{t("au.loginSub")}</p>

      <p
        style={{
          display: "flex",
          gap: 9,
          alignItems: "flex-start",
          marginTop: 16,
          padding: "11px 13px",
          background: "var(--paper-2)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          fontSize: 13.5,
          color: "var(--ink-2)",
          lineHeight: 1.5,
        }}
      >
        <Icon name="shield" size={16} sw={1.9} stroke="var(--green)" />
        <span>{t("au.newAccount")}</span>
      </p>

      <label style={{ display: "block", marginTop: 24 }}>
        <span
          style={{
            display: "block",
            fontSize: 13.5,
            fontWeight: 600,
            marginBottom: 7,
            color: "var(--ink-2)",
          }}
        >
          {t("au.emailLabel")}
        </span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t("au.emailPh")}
          aria-invalid={!!error}
          className="eb-input"
          style={{ borderColor: error ? "var(--crimson)" : "var(--line-2)" }}
        />
        {error && (
          <span role="alert" style={{ display: "block", color: "var(--crimson)", fontSize: 12.5, marginTop: 6 }}>
            {error}
          </span>
        )}
      </label>

      <button
        type="button"
        className="btn btn-primary"
        onClick={submit}
        disabled={sending}
        style={{ width: "100%", marginTop: 18, opacity: sending ? 0.7 : 1 }}
      >
        {sending ? t("co.processing") : t("au.sendOtp")}
        {!sending && <Icon name="arrow" size={18} sw={2.2} />}
      </button>

      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 18, textAlign: "center" }}>
        {t("au.terms")}
      </p>
    </div>
  );
}
