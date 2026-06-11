import { AppFrame } from "@/components/layout/AppFrame";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CheckoutLoading() {
  return (
    <AppFrame>
      <div className="wrap" style={{ padding: "34px 28px 90px", maxWidth: 560 }}>
        <Skeleton w={150} h={28} style={{ marginBottom: 10 }} />
        <Skeleton w="60%" h={15} style={{ marginBottom: 24 }} />

        {/* item being purchased */}
        <div className="card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
          <Skeleton w={72} h={72} r={12} style={{ flex: "0 0 auto" }} />
          <div style={{ flex: 1, display: "grid", gap: 9 }}>
            <Skeleton w="62%" h={16} />
            <Skeleton w="38%" h={14} />
          </div>
        </div>

        {/* escrow fee breakdown */}
        <div className="card" style={{ padding: 20, marginTop: 16, display: "grid", gap: 14 }}>
          {[60, 52, 64].map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton w={`${w}%`} h={14} style={{ maxWidth: 220 }} />
              <Skeleton w={72} h={14} />
            </div>
          ))}
          <div style={{ height: 1, background: "var(--line)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Skeleton w={80} h={18} />
            <Skeleton w={96} h={18} />
          </div>
        </div>

        {/* pay button */}
        <Skeleton h={50} r={999} style={{ marginTop: 20 }} />
      </div>
    </AppFrame>
  );
}
