import type { CSSProperties } from "react";

/** A single shimmering placeholder block. Server-safe (no client hooks),
 *  so it works in both route-level loading.tsx and client components. */
export function Skeleton({
  w = "100%",
  h = 14,
  r = 8,
  style,
}: {
  w?: number | string;
  h?: number | string;
  r?: number | string;
  style?: CSSProperties;
}) {
  return (
    <span
      className="eb-sk"
      aria-hidden="true"
      style={{ width: w, height: h, borderRadius: r, ...style }}
    />
  );
}

/** Matches the real ListingCard footprint (image + title + price + meta row). */
export function ListingCardSkeleton() {
  return (
    <div className="card" style={{ overflow: "hidden" }} aria-hidden="true">
      <Skeleton h={150} r={0} />
      <div style={{ padding: "14px 15px 16px", display: "grid", gap: 9 }}>
        <Skeleton w="82%" h={15} />
        <Skeleton w="44%" h={18} />
        <Skeleton w="56%" h={12} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
            paddingTop: 12,
            borderTop: "1px solid var(--line)",
          }}
        >
          <Skeleton w={86} h={20} r={999} />
          <Skeleton w={34} h={12} style={{ marginLeft: "auto" }} />
        </div>
      </div>
    </div>
  );
}

/** A responsive grid of card skeletons that mirrors `.eb-listing-grid`. */
export function ListingGridSkeleton({
  count = 8,
  style,
}: {
  count?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className="eb-listing-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 22,
        margin: "26px 0 80px",
        ...style,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** A circle avatar + two text lines — the shape shared by chat rows and
 *  transaction rows. `lines` controls the stacked line count. */
export function RowSkeleton({
  avatar = 48,
  height = 76,
}: {
  avatar?: number;
  height?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        height,
        padding: "0 6px",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <Skeleton w={avatar} h={avatar} r={999} style={{ flex: "0 0 auto" }} />
      <div style={{ flex: 1, display: "grid", gap: 8 }}>
        <Skeleton w="40%" h={14} />
        <Skeleton w="68%" h={12} />
      </div>
      <Skeleton w={36} h={11} style={{ flex: "0 0 auto" }} />
    </div>
  );
}
