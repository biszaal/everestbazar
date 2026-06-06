"use client";

import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { formatRelative } from "@/lib/format";
import type { Review } from "@/lib/reviews";

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }} aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon
          key={i}
          name="star"
          size={size}
          stroke={i < Math.round(rating) ? "var(--gold)" : "var(--paper-3)"}
        />
      ))}
    </span>
  );
}

export function ReviewItem({ review }: { review: Review }) {
  const { lang } = useT();
  return (
    <div style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "var(--paper-3)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--display)",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {review.reviewer[0]}
        </span>
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: 14.5 }}>{review.reviewer}</strong>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <Stars rating={review.rating} />
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
              {formatRelative(review.ts, lang)}
            </span>
          </div>
        </div>
      </div>
      <p style={{ color: "var(--ink-2)", marginTop: 10, fontSize: 14.5, lineHeight: 1.6 }}>
        {review.comment[lang]}
      </p>
    </div>
  );
}
