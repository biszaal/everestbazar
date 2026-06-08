/* Maps Supabase rows → the shapes the existing UI components consume, so we can
   swap the data source without changing component layouts. GeoThumb hue/seed are
   derived deterministically from the listing uuid (no hue column in the DB). */

import type { ListingRow } from "@/lib/database.types";
import type { Condition } from "@/lib/types";
import type { ListingCategory } from "@/lib/listings";
import type { Bilingual, Lang } from "@/lib/i18n";
import { sellerSlug, type RichListing, type Seller, type Spec } from "@/lib/catalog";

export interface UiSeller extends Seller {
  id: string;
  slug: string;
}

export interface UiListing {
  id: string;
  seed: number;
  cat: ListingCategory;
  hue: number;
  en: string;
  ne: string;
  price: number;
  loc: Record<Lang, string>;
  rating: number;
  condition: Condition;
  description: Bilingual;
  subcategory: Bilingual;
  seller: UiSeller;
  specs: Spec[];
  photos: number[];
  photoUrls: string[];
}

/** Public CDN URL for a path in the public `listing-photos` bucket. */
export function publicPhotoUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/listing-photos/${path}`;
}

function hashInt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const SUBCAT_TO_CAT: Record<string, ListingCategory> = {
  Mobiles: "mobile",
  Electronics: "electronics",
  Vehicles: "vehicles",
  Furniture: "furniture",
  Home: "home",
  Fashion: "fashion",
};

function uiCategory(row: ListingRow): ListingCategory {
  if (SUBCAT_TO_CAT[row.subcategory]) return SUBCAT_TO_CAT[row.subcategory];
  switch (row.category) {
    case "VEHICLES": return "vehicles";
    case "FURNITURE": return "furniture";
    case "FASHION": return "fashion";
    case "OTHER": return "home";
    default: return "electronics";
  }
}

function deriveSpecs(row: ListingRow, cat: ListingCategory): Spec[] {
  const [brand, ...rest] = row.title.split(" ");
  const model = rest.join(" ").split("·")[0].trim() || row.title;
  const common: Spec[] = [
    { label: { en: "Category", ne: "कोटि" }, value: row.subcategory || cat },
    { label: { en: "Location", ne: "स्थान" }, value: row.city },
  ];
  if (cat === "mobile" || cat === "electronics") {
    return [
      { label: { en: "Brand", ne: "ब्रान्ड" }, value: brand },
      { label: { en: "Model", ne: "मोडेल" }, value: model },
      ...common,
    ];
  }
  if (cat === "vehicles") {
    return [
      { label: { en: "Make", ne: "निर्माता" }, value: brand },
      { label: { en: "Model", ne: "मोडेल" }, value: model },
      ...common,
    ];
  }
  return [{ label: { en: "Type", ne: "प्रकार" }, value: model }, ...common];
}

/** Public-safe subset of a profile row (what listing joins / public reads return). */
export interface SellerPublicRow {
  id: string;
  name: string | null;
  kyc_status: string;
  trust_score: number;
  completed_sales: number;
  avg_rating?: number;
  created_at: string;
}

export function adaptSeller(p: SellerPublicRow): UiSeller {
  return {
    id: p.id,
    slug: sellerSlug(p.name || "seller"),
    name: p.name || "Seller",
    initial: (p.name || "S").charAt(0),
    verified: p.kyc_status === "VERIFIED",
    trust: p.trust_score,
    sales: p.completed_sales,
    since: p.created_at ? new Date(p.created_at).getFullYear().toString() : "2025",
  };
}

/** uuid v4-ish check — distinguishes DB ids from legacy numeric demo ids. */
export function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/** Deterministic numeric seed for GeoThumb art from any id (uuid or number). */
export function toSeed(id: string | number): number {
  return typeof id === "number" ? id : hashInt(id);
}

type ListingRowWithSeller = ListingRow & { profiles?: SellerPublicRow | null };

export function adaptListing(row: ListingRowWithSeller): UiListing {
  const seed = hashInt(row.id);
  const cat = uiCategory(row);
  const seller: UiSeller = row.profiles
    ? adaptSeller(row.profiles)
    : {
        id: row.seller_id,
        slug: "seller",
        name: "Seller",
        initial: "S",
        verified: true,
        trust: 80,
        sales: 0,
        since: "2025",
      };
  return {
    id: row.id,
    seed,
    cat,
    hue: seed % 360,
    en: row.title,
    ne: row.title, // DB has no per-listing Nepali; falls back to the title
    price: row.price_npr,
    loc: { en: row.city, ne: row.city },
    rating: row.profiles?.avg_rating ?? 4.8,
    condition: row.condition,
    description: { en: row.description, ne: row.description },
    subcategory: { en: row.subcategory, ne: row.subcategory },
    seller,
    specs: deriveSpecs(row, cat),
    photos: [seed, seed + 7, seed + 13, seed + 19],
    photoUrls: (row.photo_paths ?? []).map(publicPhotoUrl),
  };
}

/** Bridge: adapt a static catalog listing (numeric id) to the UiListing shape,
    so legacy numeric-id links (mock dashboards/chat) keep resolving during the
    cut-over. Remove once all data is DB-backed. */
export function adaptStaticListing(r: RichListing): UiListing {
  return {
    id: String(r.id),
    seed: r.id,
    cat: r.cat,
    hue: r.hue,
    en: r.en,
    ne: r.ne,
    price: r.price,
    loc: r.loc,
    rating: r.rating,
    condition: r.condition,
    description: r.description,
    subcategory: r.subcategory,
    seller: { ...r.seller, id: "", slug: sellerSlug(r.seller.name) },
    specs: r.specs,
    photos: r.photos,
    photoUrls: [],
  };
}
