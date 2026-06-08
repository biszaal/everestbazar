"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { KycSteps } from "@/components/kyc/KycSteps";
import { ImageDrop } from "@/components/ui/ImageDrop";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { toSeed } from "@/lib/adapters";
import { useUser, useAuthHydrated } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { getTransaction, type MyTxn } from "@/lib/data";
import { rs } from "@/lib/format";
import type { StringKey } from "@/lib/i18n";

const REASONS: StringKey[] = ["dp.r1", "dp.r2", "dp.r3"];

export function DisputeClient({ txnId }: { txnId: string }) {
  const { t, lang } = useT();
  const router = useRouter();
  const authHydrated = useAuthHydrated();
  const user = useUser();
  const [txn, setTxn] = useState<MyTxn | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [step, setStep] = useState(0);
  const [reason, setReason] = useState<number | null>(null);
  const [desc, setDesc] = useState("");
  const [evidence, setEvidence] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!authHydrated) return;
    if (!user) {
      router.replace(`/login?redirect=/dispute/${txnId}`);
      return;
    }
    getTransaction(createClient(), txnId, user.id)
      .then(setTxn)
      .finally(() => setLoaded(true));
  }, [authHydrated, user, txnId, router]);

  useEffect(() => {
    if (!loaded || done) return;
    if (!txn || txn.role !== "buyer" || txn.status !== "ESCROW_HELD") {
      router.replace("/purchases");
    }
  }, [loaded, txn, router, done]);

  if (!loaded || !txn) return null;

  const next = () => {
    if (step === 0) {
      if (reason === null) return setErrors([t("dp.reasonReq")]);
      setErrors([]);
      setStep(1);
    } else if (step === 1) {
      if (!desc.trim()) return setErrors([t("dp.descReq")]);
      setErrors([]);
      setStep(2);
    }
  };

  const submit = async () => {
    const reasonText = reason !== null ? `${t(REASONS[reason])}: ${desc}` : desc;
    const { error } = await createClient().rpc("open_dispute", {
      p_txn_id: txn.id,
      p_reason: reasonText,
      p_evidence: evidence ? [evidence] : [],
    });
    if (error) {
      setErrors([error.message]);
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) {
    return (
      <div className="wrap" style={{ padding: "60px 28px 90px", maxWidth: 560 }}>
        <div className="card" style={{ padding: "40px 32px", textAlign: "center", borderRadius: 22 }}>
          <div
            className="eb-pop"
            style={{
              width: 84,
              height: 84,
              borderRadius: 999,
              margin: "0 auto 22px",
              display: "grid",
              placeItems: "center",
              background: "color-mix(in oklab, var(--steel) 16%, var(--paper))",
            }}
          >
            <Icon name="shield" size={42} sw={1.9} stroke="var(--steel)" />
          </div>
          <h1 style={{ fontSize: 25 }}>{t("dp.doneTitle")}</h1>
          <p style={{ color: "var(--ink-2)", marginTop: 12, fontSize: 15.5, lineHeight: 1.6 }}>
            {t("dp.doneBody")}
          </p>
          <Link href="/purchases" className="btn btn-primary" style={{ marginTop: 24 }}>
            {t("dp.viewPurchases")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: "34px 28px 90px", maxWidth: 600 }}>
      <h1 style={{ fontSize: "clamp(24px,3vw,32px)" }}>{t("dp.title")}</h1>

      {/* item ref */}
      <div className="card" style={{ marginTop: 18, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 10, overflow: "hidden", flex: "0 0 auto" }}>
          <GeoThumb hue={txn.hue} seed={toSeed(txn.listingId)} height={52} />
        </div>
        <div style={{ flex: 1 }}>
          <strong style={{ fontFamily: "var(--display)", fontSize: 15 }}>
            {lang === "ne" ? txn.titleNe : txn.titleEn}
          </strong>
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            {t("es.with")} {txn.counterpart} · {rs(txn.priceNPR, lang)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <KycSteps current={step} />
      </div>

      <div style={{ marginTop: 22 }}>
        {step === 0 && (
          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 18, marginBottom: 14 }}>
              {t("dp.s1")}
            </legend>
            <div style={{ display: "grid", gap: 10 }}>
              {REASONS.map((r, i) => {
                const on = reason === i;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      textAlign: "left",
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: "1.5px solid",
                      borderColor: on ? "var(--crimson)" : "var(--line-2)",
                      background: on ? "color-mix(in oklab, var(--crimson) 5%, var(--paper))" : "var(--paper)",
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        border: "2px solid",
                        borderColor: on ? "var(--crimson)" : "var(--line-2)",
                        display: "grid",
                        placeItems: "center",
                        flex: "0 0 auto",
                      }}
                    >
                      {on && <span style={{ width: 9, height: 9, borderRadius: 999, background: "var(--crimson)" }} />}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{t(r)}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 18 }}>{t("dp.s2")}</h2>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, 600))}
              placeholder={t("dp.descPh")}
              rows={5}
              className="eb-input"
              style={{ marginTop: 12, resize: "vertical", lineHeight: 1.5 }}
            />
            <div style={{ marginTop: 16 }}>
              <ImageDrop
                label={t("dp.evidence")}
                hint={t("kyc.dropHint")}
                removeLabel={t("kyc.remove")}
                value={evidence}
                onChange={setEvidence}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 18 }}>{t("dp.s3")}</h2>
            <div className="card" style={{ marginTop: 14, padding: "16px 18px" }}>
              <Field label={t("dp.reason")} value={reason !== null ? t(REASONS[reason]) : "—"} />
              <div style={{ height: 1, background: "var(--line)", margin: "10px 0" }} />
              <Field label={t("dp.s2")} value={desc} />
              {evidence && (
                <div style={{ marginTop: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={evidence}
                    alt="evidence"
                    style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <p role="alert" style={{ color: "var(--crimson)", fontSize: 13.5, marginTop: 14 }}>
            {errors[0]}
          </p>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          {step > 0 && (
            <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
              {t("dp.back")}
            </button>
          )}
          {step < 2 ? (
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={next}>
              {t("dp.next")} <Icon name="arrow" size={18} sw={2.2} />
            </button>
          ) : (
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={submit}>
              {t("dp.submit")} <Icon name="shield" size={18} sw={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, color: "var(--ink-soft)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <div style={{ fontSize: 14.5, marginTop: 4 }}>{value}</div>
    </div>
  );
}
