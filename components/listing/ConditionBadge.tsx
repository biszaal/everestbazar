"use client";

import { useT } from "@/components/providers/LanguageProvider";
import type { Condition } from "@/lib/types";
import type { StringKey } from "@/lib/i18n";

const STYLE: Record<Condition, { bg: string; color: string }> = {
  LIKE_NEW: { bg: "rgba(63,125,82,0.12)", color: "var(--green)" },
  GOOD: { bg: "rgba(192,105,46,0.14)", color: "var(--terracotta)" },
  FAIR: { bg: "rgba(33,27,22,0.08)", color: "var(--ink-soft)" },
  FOR_PARTS: { bg: "rgba(190,58,43,0.12)", color: "var(--crimson)" },
};

export function ConditionBadge({
  condition,
  overlay,
}: {
  condition: Condition;
  /** style for sitting on top of an image */
  overlay?: boolean;
}) {
  const { t } = useT();
  const s = STYLE[condition];
  return (
    <span
      className="badge"
      style={
        overlay
          ? { background: "rgba(33,27,22,0.78)", color: "var(--paper)" }
          : { background: s.bg, color: s.color }
      }
    >
      {t(`cond.${condition}` as StringKey)}
    </span>
  );
}
