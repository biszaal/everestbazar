import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppFrame } from "@/components/layout/AppFrame";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { CATALOG, getListing } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Secure checkout",
  robots: { index: false },
};

export function generateStaticParams() {
  return CATALOG.map((it) => ({ id: String(it.id) }));
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const listing = getListing(Number(params.id));
  if (!listing) notFound();
  return (
    <AppFrame showFooter={false}>
      <CheckoutClient listing={listing} />
    </AppFrame>
  );
}
