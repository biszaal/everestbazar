import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { DisputeClient } from "@/components/dispute/DisputeClient";

export const metadata: Metadata = {
  title: "Raise a dispute",
  robots: { index: false },
};

export default function DisputePage({ params }: { params: { txnId: string } }) {
  return (
    <AppFrame showFooter={false}>
      <DisputeClient txnId={params.txnId} />
    </AppFrame>
  );
}
