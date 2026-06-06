"use client";

import Link from "next/link";
import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import type { StringKey } from "@/lib/i18n";

interface FormState {
  name: string;
  phone: string;
  idnum: string;
  file: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const STEP_LABELS: StringKey[] = ["sell.step1", "sell.step2", "sell.step3"];

export function SellerForm() {
  const { t } = useT();
  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormState>({
    name: "",
    phone: "",
    idnum: "",
    file: "",
  });
  const [err, setErr] = useState<FormErrors>({});

  const set =
    (k: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const validateDetails = () => {
    const e: FormErrors = {};
    if (!f.name.trim()) e.name = t("sell.errName");
    if (!/^\d{10}$/.test(f.phone.replace(/\D/g, ""))) e.phone = t("sell.errPhone");
    setErr(e);
    return Object.keys(e).length === 0;
  };
  const validateIdentity = () => {
    const e: FormErrors = {};
    if (!f.idnum.trim()) e.idnum = t("sell.errId");
    if (!f.file) e.file = t("sell.errFile");
    setErr(e);
    return Object.keys(e).length === 0;
  };

  return (
    <section
      id="sell"
      className="section"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div
        className="wrap eb-sell-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div className="eb-sell-copy">
          <span className="eyebrow on-dark">{t("sell.eyebrow")}</span>
          <h2
            style={{
              fontSize: "clamp(30px,4vw,48px)",
              marginTop: 18,
              color: "var(--paper)",
            }}
          >
            {t("sell.title")}
          </h2>
          <p
            style={{
              color: "rgba(246,240,230,0.72)",
              marginTop: 16,
              fontSize: 17,
              maxWidth: 420,
            }}
          >
            {t("sell.sub")}
          </p>
          {/* step rail */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              marginTop: 32,
            }}
          >
            {STEP_LABELS.map((label, i) => {
              const done = step > i;
              const cur = step === i;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 0",
                    opacity: cur || done ? 1 : 0.45,
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: done
                        ? "var(--gold)"
                        : cur
                          ? "var(--crimson)"
                          : "transparent",
                      border: done || cur ? "none" : "1.5px solid rgba(246,240,230,.4)",
                      color: done ? "var(--ink)" : "var(--paper)",
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {done ? (
                      <Icon name="check" size={15} sw={3} stroke="var(--ink)" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    style={{
                      fontWeight: cur ? 700 : 500,
                      fontSize: 16,
                      fontFamily: "var(--display)",
                    }}
                  >
                    {t(label)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* form card */}
        <div
          className="card"
          style={{
            background: "var(--paper)",
            color: "var(--ink)",
            padding: "34px 32px",
            borderRadius: 22,
          }}
        >
          {step === 0 && (
            <div>
              <Field label={t("sell.name")} err={err.name}>
                <input
                  value={f.name}
                  onChange={set("name")}
                  placeholder={t("sell.namePh")}
                  className="eb-input"
                />
              </Field>
              <Field label={t("sell.phone")} err={err.phone}>
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
                    value={f.phone}
                    onChange={set("phone")}
                    inputMode="numeric"
                    placeholder="98XXXXXXXX"
                    className="eb-input"
                    style={{ borderRadius: "0 12px 12px 0" }}
                  />
                </div>
              </Field>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 8 }}
                onClick={() => validateDetails() && setStep(1)}
              >
                {t("sell.continue")} <Icon name="arrow" size={18} sw={2.2} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <Field label={t("sell.idnum")} err={err.idnum}>
                <input
                  value={f.idnum}
                  onChange={set("idnum")}
                  placeholder={t("sell.idnumPh")}
                  className="eb-input"
                />
              </Field>
              <Field label={t("sell.upload")} err={err.file}>
                <UploadBox
                  file={f.file}
                  onFile={(name) => setF((p) => ({ ...p, file: name }))}
                  hint={t("sell.uploadHint")}
                  added={t("sell.fileAdded")}
                />
              </Field>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setErr({});
                    setStep(0);
                  }}
                >
                  {t("sell.back")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => validateIdentity() && setStep(2)}
                >
                  {t("sell.submit")} <Icon name="shield" size={18} sw={2} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: 999,
                  background: "color-mix(in oklab, var(--green) 16%, var(--paper))",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Icon name="check" size={42} sw={2.4} stroke="var(--green)" />
              </div>
              <h3 style={{ fontSize: 26 }}>{t("sell.successT")}</h3>
              <p
                style={{
                  color: "var(--ink-2)",
                  marginTop: 10,
                  maxWidth: 360,
                  marginInline: "auto",
                }}
              >
                {t("sell.successD")}
              </p>
              <span
                className="badge badge-verified"
                style={{ marginTop: 18, fontSize: 14, padding: "7px 14px" }}
              >
                <Icon name="check" size={14} sw={2.8} /> {f.name || "Verified seller"}
              </span>
              <div style={{ marginTop: 24 }}>
                <Link href="/sell" className="btn btn-dark">
                  {t("sell.listNow")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  err,
  children,
}: {
  label: string;
  err?: string;
  children: ReactNode;
}) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span
        style={{
          display: "block",
          fontSize: 13.5,
          fontWeight: 600,
          marginBottom: 7,
          color: "var(--ink-2)",
        }}
      >
        {label}
      </span>
      {children}
      {err && (
        <span
          role="alert"
          style={{
            display: "block",
            color: "var(--crimson)",
            fontSize: 12.5,
            marginTop: 6,
          }}
        >
          {err}
        </span>
      )}
    </label>
  );
}

function UploadBox({
  file,
  onFile,
  hint,
  added,
}: {
  file: string;
  onFile: (name: string) => void;
  hint: string;
  added: string;
}) {
  const inp = useRef<HTMLInputElement>(null);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inp.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inp.current?.click();
        }
      }}
      style={{
        border: "1.5px dashed var(--line-2)",
        borderRadius: 14,
        padding: "20px 18px",
        textAlign: "center",
        cursor: "pointer",
        background: file
          ? "color-mix(in oklab, var(--green) 8%, var(--paper))"
          : "var(--paper-2)",
        transition: "all .15s",
      }}
    >
      <input
        ref={inp}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files?.[0]?.name ?? "")}
      />
      <div style={{ display: "grid", placeItems: "center", gap: 8 }}>
        <Icon
          name={file ? "check" : "upload"}
          size={26}
          stroke={file ? "var(--green)" : "var(--ink-soft)"}
        />
        {file ? (
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--green)" }}>
            {added} · {file.length > 22 ? file.slice(0, 20) + "…" : file}
          </span>
        ) : (
          <span style={{ fontSize: 13, color: "var(--ink-soft)", maxWidth: 320 }}>
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}
