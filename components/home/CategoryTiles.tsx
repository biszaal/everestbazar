"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon, type IconName } from "@/components/brand/Icon";
import { createClient } from "@/lib/supabase/client";
import { getActiveListings } from "@/lib/data";
import type { ListingCategory } from "@/lib/listings";
import type { StringKey } from "@/lib/i18n";

const CATS: { key: ListingCategory; icon: IconName }[] = [
  { key: "mobile", icon: "phone" },
  { key: "electronics", icon: "monitor" },
  { key: "vehicles", icon: "car" },
  { key: "furniture", icon: "sofa" },
  { key: "home", icon: "house" },
  { key: "fashion", icon: "shirt" },
];

export function CategoryTiles() {
  const { t } = useT();
  const [imgByCat, setImgByCat] = useState<Record<string, string>>({});

  // pull a representative real photo per category from the live catalog
  useEffect(() => {
    let alive = true;
    getActiveListings(createClient())
      .then((rows) => {
        if (!alive) return;
        const map: Record<string, string> = {};
        for (const r of rows) {
          if (r.photoUrls?.[0] && !map[r.cat]) map[r.cat] = r.photoUrls[0];
        }
        setImgByCat(map);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="wrap" style={{ padding: "40px 28px 8px" }}>
      <h2 style={{ fontSize: "clamp(20px,2.6vw,26px)" }}>{t("cat.shop")}</h2>
      <div className="eb-cat-tiles" style={{ marginTop: 18 }}>
        {CATS.map(({ key, icon }) => {
          const img = imgByCat[key];
          return (
            <Link
              key={key}
              href={`/browse?cat=${key}`}
              className="eb-cat-tile"
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: 116,
                alignItems: "flex-end",
                padding: 0,
                border: "1px solid var(--line)",
                background: "var(--paper-2)",
              }}
            >
              {img && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(33,27,22,0.82) 0%, rgba(33,27,22,0.25) 50%, rgba(33,27,22,0.04) 100%)",
                    }}
                  />
                </>
              )}
              <span
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 13px",
                  color: img ? "#fff" : "var(--ink)",
                }}
              >
                <Icon name={icon} size={18} sw={2} stroke={img ? "#fff" : "var(--crimson)"} />
                <span style={{ fontSize: 14.5, fontWeight: 700 }}>
                  {t(`cat.${key}` as StringKey)}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
