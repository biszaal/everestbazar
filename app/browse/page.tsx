import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { BrowseClient } from "@/components/browse/BrowseClient";

export const metadata: Metadata = {
  title: "Browse verified listings",
  description:
    "Browse phones, laptops, vehicles and more from verified Nepali sellers. Every purchase is protected by escrow on EverestBazar.",
  alternates: { canonical: "/browse" },
};

export default function BrowsePage() {
  return (
    <AppFrame>
      <BrowseClient />
    </AppFrame>
  );
}
