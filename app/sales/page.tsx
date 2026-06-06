import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { TxnDashboard } from "@/components/dashboard/TxnDashboard";

export const metadata: Metadata = {
  title: "My sales",
  robots: { index: false },
};

export default function SalesPage() {
  return (
    <AppFrame>
      <TxnDashboard role="seller" />
    </AppFrame>
  );
}
