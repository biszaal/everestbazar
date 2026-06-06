import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { CreateListingClient } from "@/components/sell/CreateListingClient";

export const metadata: Metadata = {
  title: "Create a listing",
  robots: { index: false },
};

export default function NewListingPage() {
  return (
    <AppFrame>
      <CreateListingClient />
    </AppFrame>
  );
}
