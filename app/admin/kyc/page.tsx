import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { AdminKyc } from "@/components/admin/AdminKyc";

export const metadata: Metadata = {
  title: "KYC review",
  robots: { index: false },
};

export default function AdminKycPage() {
  return (
    <AppFrame>
      <AdminKyc />
    </AppFrame>
  );
}
