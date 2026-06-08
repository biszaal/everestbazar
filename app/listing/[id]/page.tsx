import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppFrame } from "@/components/layout/AppFrame";
import { ListingDetailClient } from "@/components/listing/ListingDetailClient";
import { createClient } from "@/lib/supabase/server";
import { getListingById, getRelatedListings } from "@/lib/data";
import { adaptStaticListing, isUuid, type UiListing } from "@/lib/adapters";
import { getListing as getStaticListing, relatedListings as staticRelated } from "@/lib/catalog";
import { rs } from "@/lib/format";

async function resolve(id: string): Promise<{ listing: UiListing | null; related: UiListing[] }> {
  if (isUuid(id)) {
    const sb = createClient();
    const listing = await getListingById(sb, id);
    const related = listing ? await getRelatedListings(sb, listing) : [];
    return { listing, related };
  }
  // bridge: legacy numeric id → static catalog
  const s = getStaticListing(Number(id));
  if (!s) return { listing: null, related: [] };
  return { listing: adaptStaticListing(s), related: staticRelated(s).map(adaptStaticListing) };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { listing } = await resolve(params.id);
  if (!listing) return { title: "Listing not found" };
  const title = `${listing.en} — ${rs(listing.price)}`;
  return {
    title,
    description: `${listing.description.en.slice(0, 150)} Verified seller, escrow-protected on EverestBazar.`,
    alternates: { canonical: `/listing/${listing.id}` },
    openGraph: { title: `${title} | EverestBazar`, description: listing.description.en.slice(0, 150), type: "website" },
  };
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const { listing, related } = await resolve(params.id);
  if (!listing) notFound();
  return (
    <AppFrame>
      <ListingDetailClient listing={listing} related={related} />
    </AppFrame>
  );
}
