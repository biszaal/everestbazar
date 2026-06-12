"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/store/authStore";
import { Icon } from "@/components/brand/Icon";

export default function VerifyPage() {
  const { t } = useT();
  const router = useRouter();
  const user = useUser();

  const [email, setEmail] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(30);
  const [resent, setResent] = useState(false);

  // guard: must have an email from the login step
  useEffect(() => {
    const e = sessionStorage.getItem("eb-email");
    if (!e) router.replace("/login");
    else setEmail(e);
  }, [router]);

  // if the link is opened in another tab of the same browser, the session
  // broadcasts here — advance this tab to the page they came from too.
  useEffect(() => {
    if (!user) return;
    const redirect = sessionStorage.getItem("eb-redirect") || "/browse";
    sessionStorage.removeItem("eb-email");
    sessionStorage.removeItem("eb-redirect");
    router.replace(redirect);
  }, [user, router]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const resend = async () => {
    if (!email) return;
    const redirect = sessionStorage.getItem("eb-redirect") || "/browse";
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`;
    await createClient().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo },
    });
    setSeconds(30);
    setResent(true);
    setTimeout(() => setResent(false), 2500);
  };

  if (!email) return null;

  return (
    <div className="card" style={{ padding: "38px 30px", borderRadius: 22, textAlign: "center" }}>
      <div
        className="eb-pop"
        style={{
          width: 76,
          height: 76,
          borderRadius: 999,
          margin: "0 auto 22px",
          display: "grid",
          placeItems: "center",
          background: "color-mix(in oklab, var(--crimson) 12%, var(--paper))",
        }}
      >
        <Icon name="mail" size={34} sw={1.8} stroke="var(--crimson)" />
      </div>

      <h1 style={{ fontSize: 26 }}>{t("au.checkTitle")}</h1>
      <p style={{ color: "var(--ink-2)", marginTop: 10, fontSize: 15.5, lineHeight: 1.6 }}>
        {t("au.checkSub")}{" "}
        <strong style={{ fontFamily: "var(--mono)", fontWeight: 600, color: "var(--ink)" }}>
          {email}
        </strong>
      </p>
      <p style={{ color: "var(--ink-soft)", marginTop: 14, fontSize: 13.5, lineHeight: 1.55 }}>
        {t("au.checkHint")}
      </p>

      <div style={{ marginTop: 22, minHeight: 24 }}>
        {resent ? (
          <span
            style={{
              fontSize: 14,
              color: "var(--green)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name="check" size={15} sw={2.6} stroke="var(--green)" /> {t("au.linkResent")}
          </span>
        ) : seconds > 0 ? (
          <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>
            {t("au.resendIn")} {seconds}s
          </span>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm" onClick={resend}>
            {t("au.resendLink")}
          </button>
        )}
      </div>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
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
