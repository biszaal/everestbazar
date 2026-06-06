"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { Logo } from "@/components/brand/Logo";
import { PrayerLine } from "@/components/brand/PrayerLine";
import type { StringKey } from "@/lib/i18n";

const COLUMNS: [StringKey, StringKey[]][] = [
  ["foot.c1", ["foot.c1a", "foot.c1b", "foot.c1c"]],
  ["foot.c2", ["foot.c2a", "foot.c2b", "foot.c2c"]],
  ["foot.c3", ["foot.c3a", "foot.c3b", "foot.c3c"]],
  ["foot.c4", ["foot.c4a", "foot.c4b", "foot.c4c"]],
];

export function Footer() {
  const { t } = useT();
  return (
    <footer style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="wrap" style={{ paddingTop: 64, paddingBottom: 30 }}>
        <div
          className="eb-foot-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr repeat(4, 1fr)",
            gap: 30,
          }}
        >
          <div>
            <Logo
              size={21}
              markSize={30}
              a="var(--paper)"
              b="var(--gold)"
              mark="var(--gold)"
              snow="var(--ink)"
            />
            <p
              style={{
                color: "rgba(246,240,230,0.6)",
                marginTop: 16,
                fontSize: 14.5,
                maxWidth: 240,
              }}
            >
              {t("foot.tagline")}
            </p>
          </div>
          {COLUMNS.map(([heading, items], i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}
              >
                {t(heading)}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "16px 0 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                }}
              >
                {items.map((item, j) => (
                  <li key={j}>
                    <a
                      href="#top"
                      className="eb-footlink"
                      style={{ color: "rgba(246,240,230,0.78)", fontSize: 14.5 }}
                    >
                      {t(item)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginTop: 50,
            paddingTop: 22,
            borderTop: "1px solid rgba(246,240,230,0.14)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(246,240,230,0.55)" }}>
            {t("foot.rights")}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              fontSize: 13,
              color: "rgba(246,240,230,0.7)",
            }}
          >
            <PrayerLine height={10} /> {t("foot.madein")}
          </span>
        </div>
      </div>
    </footer>
  );
}
