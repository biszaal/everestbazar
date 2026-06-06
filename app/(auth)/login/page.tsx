"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { useAuthStore } from "@/store/authStore";
import { Icon } from "@/components/brand/Icon";
import { isValidMobileDigits } from "@/lib/validate";

export default function LoginPage() {
  const { t } = useT();
  const router = useRouter();
  const startLogin = useAuthStore((s) => s.startLogin);
  const [digits, setDigits] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("redirect");
    if (r) sessionStorage.setItem("eb-redirect", r);
  }, []);

  const valid = isValidMobileDigits(digits);
  const showError = touched && !valid;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    startLogin("+977" + digits);
    router.push("/verify");
  };

  return (
    <div className="card" style={{ padding: "34px 30px", borderRadius: 22 }}>
      <span className="eyebrow">{t("sell.eyebrow")}</span>
      <h1 style={{ fontSize: 28, marginTop: 14 }}>{t("au.welcome")}</h1>
      <p style={{ color: "var(--ink-2)", marginTop: 10, fontSize: 15.5 }}>
        {t("au.loginSub")}
      </p>

      <form onSubmit={submit} style={{ marginTop: 24 }}>
        <label style={{ display: "block" }}>
          <span
            style={{
              display: "block",
              fontSize: 13.5,
              fontWeight: 600,
              marginBottom: 7,
              color: "var(--ink-2)",
            }}
          >
            {t("sell.phone")}
          </span>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <span
              style={{
                display: "grid",
                placeItems: "center",
                padding: "0 14px",
                background: "var(--paper-2)",
                border: "1px solid var(--line-2)",
                borderRight: "none",
                borderRadius: "12px 0 0 12px",
                fontFamily: "var(--mono)",
                fontSize: 14,
                color: "var(--ink-soft)",
              }}
            >
              +977
            </span>
            <input
              value={digits}
              onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onBlur={() => setTouched(true)}
              inputMode="numeric"
              autoFocus
              placeholder="98XXXXXXXX"
              aria-invalid={showError}
              className="eb-input"
              style={{
                borderRadius: "0 12px 12px 0",
                borderColor: showError ? "var(--crimson)" : "var(--line-2)",
              }}
            />
          </div>
          {showError && (
            <span
              role="alert"
              style={{
                display: "block",
                color: "var(--crimson)",
                fontSize: 12.5,
                marginTop: 6,
              }}
            >
              {t("sell.errPhone")}
            </span>
          )}
        </label>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 18 }}
        >
          {t("au.sendOtp")} <Icon name="arrow" size={18} sw={2.2} />
        </button>
      </form>

      <p
        style={{
          fontSize: 12.5,
          color: "var(--ink-soft)",
          marginTop: 18,
          textAlign: "center",
        }}
      >
        {t("au.terms")}
      </p>
    </div>
  );
}
