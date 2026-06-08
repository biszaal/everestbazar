import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppFrame } from "@/components/layout/AppFrame";
import { PublicProfile } from "@/components/profile/PublicProfile";
import { createClient } from "@/lib/supabase/server";
import { getSellerById, getSellerListings } from "@/lib/data";
import { adaptStaticListing, isUuid, type UiListing, type UiSeller } from "@/lib/adapters";
import { getSellerBySlug } from "@/lib/catalog";
import { reviewsFor } from "@/lib/reviews";

type SellerSummary = Pick<UiSeller, "name" | "initial" | "verified" | "trust" | "sales" | "since">;

async function resolve(
  userId: string
): Promise<{ seller: SellerSummary; listings: UiListing[] } | null> {
  if (isUuid(userId)) {
    const sb = createClient();
    const seller = await getSellerById(sb, userId);
    if (!seller) return null;
    const listings = await getSellerListings(sb, userId);
    return { seller, listings };
  }
  const s = getSellerBySlug(userId);
  if (!s) return null;
  return { seller: s, listings: s.listings.map(adaptStaticListing) };
}

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
  const resolved = await resolve(params.userId);
  if (!resolved) return { title: "Seller not found" };
  const { seller } = resolved;
  return {
    title: `${seller.name} — verified seller`,
    description: `${seller.name} is a verified seller on EverestBazar with ${seller.sales} completed sales.`,
  };
}

export default async function PublicProfilePage({ params }: { params: { userId: string } }) {
  const resolved = await resolve(params.userId);
  if (!resolved) notFound();
  const reviews = reviewsFor(params.userId.length, 3);
  return (
    <AppFrame>
      <PublicProfile seller={resolved.seller} listings={resolved.listings} reviews={reviews} />
    </AppFrame>
  );
}
