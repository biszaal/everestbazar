import { AppFrame } from "@/components/layout/AppFrame";
import { Skeleton, ListingGridSkeleton } from "@/components/ui/Skeleton";

export default function PublicProfileLoading() {
  return (
    <AppFrame>
      <div className="wrap" style={{ padding: "30px 28px 90px", maxWidth: 900 }}>
        <div
          className="card"
          style={{ padding: "22px 24px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}
        >
          <Skeleton w={64} h={64} r={999} style={{ flex: "0 0 auto" }} />
          <div style={{ flex: 1, minWidth: 200, display: "grid", gap: 10 }}>
            <Skeleton w="42%" h={22} />
            <Skeleton w="56%" h={13} />
            <Skeleton w="48%" h={13} />
          </div>
          <Skeleton w={60} h={60} r={999} style={{ flex: "0 0 auto" }} />
        </div>

        <Skeleton w={150} h={20} style={{ marginTop: 32 }} />
        <ListingGridSkeleton count={4} style={{ marginTop: 18, marginBottom: 0 }} />
      </div>
    </AppFrame>
  );
}
