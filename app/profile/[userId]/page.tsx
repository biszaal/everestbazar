import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppFrame } from "@/components/layout/AppFrame";
import { PublicProfile } from "@/components/profile/PublicProfile";
import { SELLER_PROFILES, getSellerBySlug } from "@/lib/catalog";
import { reviewsFor } from "@/lib/reviews";

export function generateStaticParams() {
  return SELLER_PROFILES.map((s) => ({ userId: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Metadata {
  const seller = getSellerBySlug(params.userId);
  if (!seller) return { title: "Seller not found" };
  return {
    title: `${seller.name} — verified seller`,
    description: `${seller.name} is a verified seller on EverestBazar with ${seller.sales} completed sales.`,
    alternates: { canonical: `/profile/${seller.slug}` },
  };
}

export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  const seller = getSellerBySlug(params.userId);
  if (!seller) notFound();
  const reviews = reviewsFor(seller.slug.length, 3);
  return (
    <AppFrame>
      <PublicProfile seller={seller} reviews={reviews} />
    </AppFrame>
  );
}
