import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { TxnDashboard } from "@/components/dashboard/TxnDashboard";

export const metadata: Metadata = {
  title: "My purchases",
  robots: { index: false },
};

export default function PurchasesPage() {
  return (
    <AppFrame>
      <TxnDashboard role="buyer" />
    </AppFrame>
  );
}
