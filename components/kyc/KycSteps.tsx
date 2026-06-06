"use client";

import { useT } from "@/components/providers/LanguageProvider";

export function KycSteps({ current, total = 3 }: { current: number; total?: number }) {
  const { t } = useT();
  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              height: 6,
              flex: 1,
              borderRadius: 999,
              background: i <= current ? "var(--crimson)" : "var(--paper-3)",
              transition: "background .3s",
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--ink-soft)",
          marginTop: 10,
          letterSpacing: "0.06em",
        }}
      >
        {t("kyc.step")} {current + 1} / {total}
      </div>
    </div>
  );
}
