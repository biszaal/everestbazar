"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { GeoThumb } from "@/components/brand/GeoThumb";
import { SummitMark } from "@/components/brand/SummitMark";

export function AppCTA() {
  const { t } = useT();
  return (
    <section className="section">
      <div className="wrap">
        <div
          className="card eb-appcta"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 30,
            alignItems: "center",
            padding: "46px 48px",
            overflow: "hidden",
            position: "relative",
            background: "var(--paper-2)",
          }}
        >
          <div>
            <span className="eyebrow">{t("app.eyebrow")}</span>
            <h2
              style={{
                fontSize: "clamp(28px,3.6vw,44px)",
                marginTop: 16,
                maxWidth: 460,
              }}
            >
              {t("app.title")}
            </h2>
            <p
              style={{
                color: "var(--ink-2)",
                marginTop: 14,
                fontSize: 16.5,
                maxWidth: 420,
              }}
            >
              {t("app.sub")}
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 26,
                flexWrap: "wrap",
              }}
            >
              <StoreBadge top={t("app.onApp")} big={t("app.ios")} />
              <StoreBadge top={t("app.getOn")} big={t("app.android")} />
            </div>
          </div>
          <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
            <PhoneMock />
          </div>
        </div>
      </div>
    </section>
  );
}

function StoreBadge({ top, big }: { top: string; big: string }) {
  return (
    <a
      href="#top"
      className="btn btn-dark"
      style={{
        padding: "10px 18px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0,
        lineHeight: 1.1,
        borderRadius: 12,
      }}
    >
      <span
        style={{
          fontSize: 10.5,
          fontFamily: "var(--mono)",
          opacity: 0.7,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {top}
      </span>
      <span style={{ fontSize: 17, fontWeight: 700, fontFamily: "var(--display)" }}>
        {big}
      </span>
    </a>
  );
}

function PhoneMock() {
  const { lang } = useT();
  return (
    <div
      aria-hidden="true"
      style={{
        width: 200,
        height: 380,
        borderRadius: 34,
        background: "var(--ink)",
        padding: 9,
        boxShadow: "var(--shadow-lg)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          width: 56,
          height: 5,
          background: "rgba(246,240,230,.3)",
          borderRadius: 4,
          zIndex: 3,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 26,
          background: "var(--paper)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px 14px 10px",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <SummitMark size={20} />
          <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 14 }}>
            EverestBazar
          </span>
        </div>
        <div style={{ padding: "0 12px" }}>
          <div
            style={{
              height: 30,
              borderRadius: 999,
              background: "var(--paper-2)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 6,
              color: "var(--ink-soft)",
            }}
          >
            <Icon name="search" size={13} />
            <span style={{ fontSize: 11 }}>
              {lang === "ne" ? "खोज्नुहोस्" : "Search"}
            </span>
          </div>
        </div>
        <div
          style={{
            padding: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {[28, 230, 86, 50].map((h, i) => (
            <div
              key={i}
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--line)",
              }}
            >
              <GeoThumb hue={h} seed={i + 2} height={56} />
              <div style={{ padding: "5px 6px" }}>
                <div
                  style={{
                    height: 6,
                    width: "80%",
                    background: "var(--paper-3)",
                    borderRadius: 3,
                  }}
                />
                <div
                  style={{
                    height: 7,
                    width: "50%",
                    background: "var(--crimson)",
                    borderRadius: 3,
                    marginTop: 5,
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
