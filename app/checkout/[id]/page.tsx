import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppFrame } from "@/components/layout/AppFrame";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { createClient } from "@/lib/supabase/server";
import { getListingById } from "@/lib/data";
import { adaptStaticListing, isUuid, type UiListing } from "@/lib/adapters";
import { getListing as getStaticListing } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Secure checkout",
  robots: { index: false },
};

async function resolve(id: string): Promise<UiListing | null> {
  if (isUuid(id)) return getListingById(createClient(), id);
  const s = getStaticListing(Number(id));
  return s ? adaptStaticListing(s) : null;
}

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  const listing = await resolve(params.id);
  if (!listing) notFound();
  return (
    <AppFrame showFooter={false}>
      <CheckoutClient listing={listing} />
    </AppFrame>
  );
}
