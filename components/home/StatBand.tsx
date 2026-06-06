"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { SummitMark } from "@/components/brand/SummitMark";
import { toDevanagariDigits } from "@/lib/format";

export function StatBand() {
  const { t, lang } = useT();
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let interval: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let v = 0;
          interval = setInterval(() => {
            v += 1;
            setN(v);
            if (v >= 6 && interval) clearInterval(interval);
          }, 130);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  const display = lang === "ne" ? toDevanagariDigits(n) : n;

  return (
    <section
      ref={ref}
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, opacity: 0.06 }}
      >
        <svg
          viewBox="0 0 1440 360"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
        >
          <path
            d="M0,360 L300,140 L460,240 L720,90 L980,240 L1200,120 L1440,240 L1440,360 Z"
            fill="var(--paper)"
          />
        </svg>
      </div>
      <div
        className="wrap section-tight eb-stat-grid"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div
          className="eb-stat-num"
          style={{ display: "flex", alignItems: "baseline", gap: 6 }}
        >
          <span
            style={{
              fontFamily: "var(--display)",
              fontWeight: 800,
              fontSize: "clamp(90px,13vw,170px)",
              lineHeight: 0.9,
              color: "var(--crimson)",
            }}
          >
            {display}×
          </span>
        </div>
        <div>
          <p
            style={{
              fontSize: "clamp(20px,2.4vw,30px)",
              fontFamily: "var(--display)",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {t("stat.pre")}{" "}
            <span style={{ color: "var(--gold)" }}>{t("stat.unit")}</span>.
          </p>
          <p
            style={{
              color: "rgba(246,240,230,0.7)",
              marginTop: 14,
              fontSize: 17,
              maxWidth: 520,
            }}
          >
            {t("stat.post")}
          </p>
          <p
            style={{
              marginTop: 18,
              fontSize: 18,
              fontWeight: 600,
              color: "var(--paper)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ width: 26, flex: "0 0 auto" }}>
              <SummitMark size={26} fill="var(--gold)" snow="var(--ink)" />
            </span>
            {t("stat.reassure")}
          </p>
        </div>
      </div>
    </section>
  );
}
