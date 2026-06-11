import { AppFrame } from "@/components/layout/AppFrame";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ListingLoading() {
  return (
    <AppFrame>
      <div className="wrap" style={{ padding: "26px 28px 90px" }}>
        <Skeleton w={90} h={14} style={{ marginBottom: 18 }} />

        <div
          className="eb-detail-grid"
          style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 40, alignItems: "start" }}
        >
          {/* gallery */}
          <div>
            <Skeleton h={420} r={20} />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} w={74} h={56} r={10} />
              ))}
            </div>
          </div>

          {/* summary */}
          <div style={{ display: "grid", gap: 14 }}>
            <Skeleton w={170} h={36} r={10} />
            <Skeleton w={120} h={26} r={999} />
            <Skeleton w="82%" h={28} />
            <Skeleton w="46%" h={16} />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Skeleton h={48} r={999} style={{ flex: "1 1 200px" }} />
              <Skeleton w={130} h={48} r={999} />
            </div>
            <div
              className="card"
              style={{ marginTop: 10, padding: 18, display: "flex", gap: 14, alignItems: "center" }}
            >
              <Skeleton w={46} h={46} r={999} style={{ flex: "0 0 auto" }} />
              <div style={{ flex: 1, display: "grid", gap: 8 }}>
                <Skeleton w="42%" h={16} />
                <Skeleton w="62%" h={12} />
              </div>
              <Skeleton w={48} h={48} r={999} style={{ flex: "0 0 auto" }} />
            </div>
          </div>
        </div>

        {/* about + specs */}
        <div
          className="eb-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 40,
            marginTop: 40,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 11 }}>
            <Skeleton w={120} h={20} />
            <Skeleton h={14} />
            <Skeleton h={14} />
            <Skeleton w="86%" h={14} />
            <Skeleton w="68%" h={14} />
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            <Skeleton w={100} h={20} />
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  paddingBottom: 11,
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <Skeleton w={90} h={14} />
                <Skeleton w={120} h={14} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
