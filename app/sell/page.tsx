import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { SellGate } from "@/components/sell/SellGate";

export const metadata: Metadata = {
  title: "Sell on EverestBazar",
  description:
    "Sell safely on Nepal's verified marketplace. Get verified once against your National ID, list in minutes, and get paid securely through escrow.",
  alternates: { canonical: "/sell" },
};

export default function SellPage() {
  return (
    <AppFrame>
      <SellGate />
    </AppFrame>
  );
}
