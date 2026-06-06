"use client";

import { useT } from "@/components/providers/LanguageProvider";
import type { Lang } from "@/lib/i18n";

export function LangToggle() {
  const { lang, setLang } = useT();
  const options: [Lang, string][] = [
    ["en", "EN"],
    ["ne", "ने"],
  ];
  return (
    <div
      role="group"
      aria-label="Language"
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--paper-2)",
        border: "1px solid var(--line)",
        borderRadius: 999,
        padding: 3,
      }}
    >
      {options.map(([value, label]) => {
        const active = lang === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(value)}
            style={{
              border: "none",
              background: active ? "var(--ink)" : "transparent",
              color: active ? "var(--paper)" : "var(--ink-soft)",
              padding: "5px 11px",
              borderRadius: 999,
              fontWeight: 600,
              transition: "all .15s",
              fontFamily: "var(--mono)",
              fontSize: 12.5,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
