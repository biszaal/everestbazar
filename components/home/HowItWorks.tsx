"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { Icon, type IconName } from "@/components/brand/Icon";
import { useReveal } from "@/lib/useReveal";
import type { StringKey } from "@/lib/i18n";

interface Step {
  ic: IconName;
  t: StringKey;
  d: StringKey;
  tint: string;
}

const STEPS: Step[] = [
  { ic: "id", t: "how.s1t", d: "how.s1d", tint: "var(--crimson)" },
  { ic: "lock", t: "how.s2t", d: "how.s2d", tint: "var(--steel)" },
  { ic: "scales", t: "how.s3t", d: "how.s3d", tint: "var(--terracotta)" },
];

export function HowItWorks() {
  const { t } = useT();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="how" className="section">
      <div className="wrap">
        <div ref={ref} className="reveal" style={{ maxWidth: 720 }}>
          <span className="eyebrow">{t("how.eyebrow")}</span>
          <h2 style={{ fontSize: "clamp(30px,4vw,48px)", marginTop: 18 }}>
            {t("how.title")}
          </h2>
        </div>
        <div
          className="eb-how-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 24,
            marginTop: 46,
          }}
        >
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: "30px 28px 32px", position: "relative" }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `color-mix(in oklab, ${s.tint} 12%, var(--paper))`,
                  color: s.tint,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={s.ic} size={26} stroke={s.tint} />
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--ink-soft)",
                  marginTop: 22,
                }}
              >
                0{i + 1}
              </div>
              <h3 style={{ fontSize: 22, marginTop: 6 }}>{t(s.t)}</h3>
              <p
                style={{
                  color: "var(--ink-2)",
                  marginTop: 10,
                  fontSize: 15.5,
                  lineHeight: 1.6,
                }}
              >
                {t(s.d)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
