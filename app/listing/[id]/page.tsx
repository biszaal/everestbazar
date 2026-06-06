import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppFrame } from "@/components/layout/AppFrame";
import { ListingDetailClient } from "@/components/listing/ListingDetailClient";
import { CATALOG, getListing, relatedListings } from "@/lib/catalog";
import { rs } from "@/lib/format";

export function generateStaticParams() {
  return CATALOG.map((it) => ({ id: String(it.id) }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const listing = getListing(Number(params.id));
  if (!listing) return { title: "Listing not found" };
  const title = `${listing.en} — ${rs(listing.price)}`;
  return {
    title,
    description: `${listing.description.en.slice(0, 150)} Verified seller, escrow-protected on EverestBazar.`,
    alternates: { canonical: `/listing/${listing.id}` },
    openGraph: {
      title: `${title} | EverestBazar`,
      description: listing.description.en.slice(0, 150),
      type: "website",
    },
  };
}

export default function ListingPage({ params }: { params: { id: string } }) {
  const listing = getListing(Number(params.id));
  if (!listing) notFound();
  const related = relatedListings(listing);
  return (
    <AppFrame>
      <ListingDetailClient listing={listing} related={related} />
    </AppFrame>
  );
}
