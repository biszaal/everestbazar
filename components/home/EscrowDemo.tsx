"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon, type IconName } from "@/components/brand/Icon";
import type { StringKey } from "@/lib/i18n";

interface EscrowStep {
  t: StringKey;
  d: StringKey;
  ic: IconName;
}

const STEPS: EscrowStep[] = [
  { t: "escrow.s1t", d: "escrow.s1d", ic: "coin" },
  { t: "escrow.s2t", d: "escrow.s2d", ic: "lock" },
  { t: "escrow.s3t", d: "escrow.s3d", ic: "box" },
  { t: "escrow.s4t", d: "escrow.s4d", ic: "check" },
  { t: "escrow.s5t", d: "escrow.s5d", ic: "coin" },
];

const NODE_X = [10, 30, 50, 70, 90];

export function EscrowDemo() {
  const { t } = useT();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    setPlaying(false);
  };
  const play = () => {
    if (timer.current) clearInterval(timer.current);
    setStep(0);
    setPlaying(true);
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          if (timer.current) clearInterval(timer.current);
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2000);
  };
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const locked = step >= 1 && step <= 3;
  const released = step >= 4;
  const coinX = step <= 1 ? NODE_X[Math.max(0, step)] : released ? 90 : 50;
  const progressPct = (step / (STEPS.length - 1)) * 100;

  return (
    <section className="section" style={{ background: "var(--paper-2)" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            {t("escrow.eyebrow")}
          </span>
          <h2 style={{ fontSize: "clamp(30px,4vw,48px)", marginTop: 18 }}>
            {t("escrow.title")}
          </h2>
          <p style={{ color: "var(--ink-2)", marginTop: 14, fontSize: 17 }}>
            {t("escrow.sub")}
          </p>
        </div>

        <div
          className="card"
          style={{
            marginTop: 44,
            padding: "44px 36px 34px",
            maxWidth: 940,
            marginInline: "auto",
          }}
        >
          {/* actors */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 6,
            }}
          >
            <Actor label="Buyer" sub="तपाईं" active={step === 0 || step === 3} />
            <Vault locked={locked} released={released} />
            <Actor label="Seller" sub="बिक्रेता" active={step === 2} />
          </div>

          {/* track */}
          <div style={{ position: "relative", height: 64, margin: "10px 4px 0" }}>
            <div
              style={{
                position: "absolute",
                top: 31,
                left: "10%",
                right: "10%",
                height: 4,
                background: "var(--paper-3)",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 31,
                left: "10%",
                width: `calc(${progressPct}% * 0.8)`,
                height: 4,
                background: "var(--crimson)",
                borderRadius: 4,
                transition: "width .6s cubic-bezier(.4,0,.2,1)",
              }}
            />
            {NODE_X.map((x, i) => {
              const done = i < step;
              const cur = i === step;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    stop();
                    setStep(i);
                  }}
                  title={t(STEPS[i].t)}
                  aria-label={`${t(STEPS[i].t)} — step ${i + 1} of 5`}
                  style={{
                    position: "absolute",
                    top: 18,
                    left: `${x}%`,
                    transform: "translateX(-50%)",
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    border: "2px solid",
                    borderColor: cur || done ? "var(--crimson)" : "var(--paper-3)",
                    background: done ? "var(--crimson)" : "var(--paper)",
                    color: done
                      ? "var(--paper)"
                      : cur
                        ? "var(--crimson)"
                        : "var(--ink-soft)",
                    display: "grid",
                    placeItems: "center",
                    transition: "all .3s",
                    boxShadow: cur ? "0 0 0 6px rgba(190,58,43,.14)" : "none",
                    padding: 0,
                  }}
                >
                  {done ? (
                    <Icon name="check" size={15} sw={3} />
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                </button>
              );
            })}
            {/* travelling money token */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -6,
                left: `${coinX}%`,
                transform: "translateX(-50%)",
                transition: "left .7s cubic-bezier(.5,0,.2,1)",
                color: "var(--gold)",
                filter: "drop-shadow(0 4px 8px rgba(201,150,47,.4))",
              }}
            >
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: "var(--gold)",
                  color: "var(--ink)",
                }}
              >
                <Icon name="coin" size={16} sw={2.2} />
              </span>
            </div>
          </div>

          {/* caption */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              gap: 18,
              alignItems: "flex-start",
              minHeight: 78,
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--ink)",
                color: "var(--gold)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name={STEPS[step].ic} size={24} sw={2} />
            </div>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--crimson)",
                }}
              >
                {`STEP ${step + 1} / 5`}
              </span>
              <h3 style={{ fontSize: 22, marginTop: 4 }}>{t(STEPS[step].t)}</h3>
              <p style={{ color: "var(--ink-2)", marginTop: 5, fontSize: 15.5 }}>
                {t(STEPS[step].d)}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-dark btn-sm"
              onClick={playing ? stop : play}
              style={{ flex: "0 0 auto" }}
            >
              <PlayPauseGlyph playing={playing} />
              {playing
                ? t("escrow.pause")
                : step >= STEPS.length - 1
                  ? t("escrow.replay")
                  : t("escrow.play")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayPauseGlyph({ playing }: { playing: boolean }) {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor" aria-hidden="true">
      {playing ? (
        <>
          <rect x="1" y="1" width="3" height="10" rx="1" />
          <rect x="7" y="1" width="3" height="10" rx="1" />
        </>
      ) : (
        <path d="M1 1.4v9.2a1 1 0 0 0 1.5.86l7.5-4.6a1 1 0 0 0 0-1.72L2.5.54A1 1 0 0 0 1 1.4Z" />
      )}
    </svg>
  );
}

function Actor({
  label,
  sub,
  active,
}: {
  label: string;
  sub: string;
  active: boolean;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        width: 90,
        opacity: active ? 1 : 0.5,
        transition: "opacity .3s",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          margin: "0 auto",
          background: active ? "var(--crimson)" : "var(--paper-3)",
          color: active ? "var(--paper)" : "var(--ink-soft)",
          display: "grid",
          placeItems: "center",
          transition: "all .3s",
          fontFamily: "var(--display)",
          fontWeight: 800,
          fontSize: 22,
        }}
      >
        {label[0]}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 8 }}>{label}</div>
      <div
        style={{
          fontSize: 11.5,
          color: "var(--ink-soft)",
          fontFamily: "var(--body)",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function Vault({ locked, released }: { locked: boolean; released: boolean }) {
  return (
    <div style={{ textAlign: "center", width: 90 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          margin: "0 auto",
          display: "grid",
          placeItems: "center",
          transition: "all .3s",
          background: released
            ? "var(--green)"
            : locked
              ? "var(--ink)"
              : "var(--paper-3)",
          color: locked || released ? "var(--gold)" : "var(--ink-soft)",
          boxShadow: locked ? "0 0 0 6px rgba(33,27,22,.08)" : "none",
        }}
      >
        <Icon
          name={released ? "check" : "lock"}
          size={26}
          sw={2.1}
          stroke={released ? "var(--paper)" : "currentColor"}
        />
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 8 }}>Escrow</div>
      <div
        style={{
          fontSize: 11.5,
          color: locked ? "var(--crimson)" : "var(--ink-soft)",
          fontWeight: 600,
        }}
      >
        {released ? "released" : locked ? "locked" : "—"}
      </div>
    </div>
  );
}
