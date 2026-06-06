/* EverestBazar — listing catalog enrichment.
   Wraps the homepage demo data with the richer fields the detail / checkout
   pages need, derived deterministically so the demo stays consistent without
   hand-authoring 12× spec sheets. */

import { LISTINGS, type DemoListing, type ListingCategory } from "@/lib/listings";
import type { Bilingual } from "@/lib/i18n";
import type { Condition } from "@/lib/types";

export interface Seller {
  name: string;
  initial: string;
  verified: boolean;
  trust: number;
  sales: number;
  since: string;
}

export interface Spec {
  label: Bilingual;
  value: string;
}

export interface RichListing extends DemoListing {
  condition: Condition;
  description: Bilingual;
  seller: Seller;
  specs: Spec[];
  photos: number[]; // seeds for the geo-thumb gallery
  subcategory: Bilingual;
}

const SELLERS: Omit<Seller, "verified" | "trust" | "sales" | "since">[] = [
  { name: "Aarati Shrestha", initial: "आ" },
  { name: "Bibek Gurung", initial: "बि" },
  { name: "Sunita Maharjan", initial: "सु" },
  { name: "Prakash Thapa", initial: "प्र" },
  { name: "Nisha Tamang", initial: "नि" },
  { name: "Roshan Adhikari", initial: "रो" },
  { name: "Anjali Rai", initial: "अ" },
  { name: "Dipesh K.C.", initial: "दी" },
];

const CONDITIONS: Condition[] = ["LIKE_NEW", "GOOD", "FAIR"];

const CATEGORY_LABEL: Record<ListingCategory, Bilingual> = {
  mobile: { en: "Mobiles", ne: "मोबाइल" },
  electronics: { en: "Electronics", ne: "इलेक्ट्रोनिक्स" },
  vehicles: { en: "Vehicles", ne: "सवारी" },
  furniture: { en: "Furniture", ne: "फर्निचर" },
  home: { en: "Home", ne: "घरायसी" },
  fashion: { en: "Fashion", ne: "फेसन" },
};

const CATEGORY_DESCRIPTION: Record<ListingCategory, Bilingual> = {
  mobile: {
    en: "Well looked-after and fully functional. No major scratches, battery holds well through a day of normal use. Comes boxed with charger. Happy to demo over chat before you decide.",
    ne: "राम्ररी हेरचाह गरिएको र पूर्ण रूपमा कार्यशील। ठूला कोर्ने दाग छैनन्, ब्याट्री दिनभर राम्रो चल्छ। चार्जरसहित बक्समा। निर्णय गर्नुअघि च्याटमा देखाउन तयार छु।",
  },
  electronics: {
    en: "Lightly used, kept in a smoke-free home. Everything works exactly as it should. Original accessories included. Can show it powered on before any payment is released from escrow.",
    ne: "थोरै प्रयोग भएको, धुवाँरहित घरमा राखिएको। सबै कुरा ठीकसँग चल्छ। मूल सामानहरू समावेश। एस्क्रोबाट भुक्तानी जारी हुनुअघि चालु अवस्थामा देखाउन सक्छु।",
  },
  vehicles: {
    en: "Regularly serviced with papers up to date. Runs smoothly, tyres in good shape. Minor cosmetic wear consistent with age. Test ride welcome at a public meeting point.",
    ne: "नियमित सर्भिस गरिएको, कागजात अद्यावधिक। राम्रोसँग चल्छ, टायर राम्रो अवस्थामा। उमेरअनुसार सानो बाहिरी दाग। सार्वजनिक स्थानमा टेस्ट राइड स्वागत छ।",
  },
  furniture: {
    en: "Solid build, no wobble, surfaces clean. From a pet-free home. Selling only because we are moving. Buyer arranges pickup; I will help you load it.",
    ne: "बलियो बनावट, हल्लिँदैन, सतह सफा। पाल्तु जनावररहित घरबाट। सर्ने भएकाले मात्र बेच्दै। खरिदकर्ताले पिकअप मिलाउनुपर्छ; लोड गर्न म सहयोग गर्छु।",
  },
  home: {
    en: "Clean and in good working order. Used carefully and maintained well. A practical buy at this price. Ask me anything before you commit through escrow.",
    ne: "सफा र राम्रो कार्यशील अवस्थामा। सावधानीपूर्वक प्रयोग र राम्ररी मर्मत गरिएको। यो मूल्यमा व्यावहारिक किनमेल। एस्क्रोमार्फत निर्णय गर्नुअघि जे पनि सोध्नुहोस्।",
  },
  fashion: {
    en: "Genuine, gently worn and freshly cleaned. True to size. No tears or stains. Photographed in natural light so the colour is accurate.",
    ne: "साँचो, थोरै लगाइएको र भर्खरै सफा गरिएको। साइज ठीक। च्यातिएको वा दाग छैन। रङ सही देखियोस् भनेर प्राकृतिक उज्यालोमा फोटो खिचिएको।",
  },
};

function deriveSpecs(it: DemoListing): Spec[] {
  const [brand, ...rest] = it.en.split(" ");
  const model = rest.join(" ").split("·")[0].trim() || it.en;
  const common: Spec[] = [
    { label: { en: "Category", ne: "कोटि" }, value: CATEGORY_LABEL[it.cat].en },
    { label: { en: "Location", ne: "स्थान" }, value: it.loc.en },
    { label: { en: "Seller rating", ne: "बिक्रेता रेटिङ" }, value: `${it.rating.toFixed(1)} / 5` },
  ];
  switch (it.cat) {
    case "mobile":
      return [
        { label: { en: "Brand", ne: "ब्रान्ड" }, value: brand },
        { label: { en: "Model", ne: "मोडेल" }, value: model },
        { label: { en: "Battery health", ne: "ब्याट्री हेल्थ" }, value: `${88 + (it.id % 10)}%` },
        { label: { en: "Accessories", ne: "सामान" }, value: "Box, charger" },
        ...common,
      ];
    case "electronics":
      return [
        { label: { en: "Brand", ne: "ब्रान्ड" }, value: brand },
        { label: { en: "Model", ne: "मोडेल" }, value: model },
        { label: { en: "Warranty", ne: "वारेन्टी" }, value: it.id % 2 ? "Expired" : "3 months left" },
        ...common,
      ];
    case "vehicles":
      return [
        { label: { en: "Make", ne: "निर्माता" }, value: brand },
        { label: { en: "Model", ne: "मोडेल" }, value: model },
        { label: { en: "Kilometres", ne: "किलोमिटर" }, value: `${12 + (it.id % 30)},${(it.id * 137) % 900}` },
        { label: { en: "Papers", ne: "कागजात" }, value: "Up to date" },
        ...common,
      ];
    default:
      return [
        { label: { en: "Type", ne: "प्रकार" }, value: model },
        { label: { en: "Material", ne: "सामग्री" }, value: it.cat === "furniture" ? "Solid wood" : "Steel / mixed" },
        ...common,
      ];
  }
}

function enrich(it: DemoListing): RichListing {
  const sellerBase = SELLERS[it.id % SELLERS.length];
  const sales = 6 + ((it.id * 7) % 44);
  const trust = Math.min(100, Math.round(it.rating * 12 + 30 + sales * 0.5));
  return {
    ...it,
    condition: CONDITIONS[it.id % CONDITIONS.length],
    description: CATEGORY_DESCRIPTION[it.cat],
    subcategory: CATEGORY_LABEL[it.cat],
    seller: {
      ...sellerBase,
      verified: true,
      trust,
      sales,
      since: `${2021 + (it.id % 4)}`,
    },
    specs: deriveSpecs(it),
    photos: [it.id, it.id + 7, it.id + 13, it.id + 19],
  };
}

export const CATALOG: RichListing[] = LISTINGS.map(enrich);

export function getListing(id: number): RichListing | undefined {
  return CATALOG.find((it) => it.id === id);
}

export function moreFromSeller(it: RichListing, limit = 4): RichListing[] {
  return CATALOG.filter(
    (other) => other.id !== it.id && other.seller.name === it.seller.name
  ).slice(0, limit);
}

export function relatedListings(it: RichListing, limit = 4): RichListing[] {
  const sameCat = CATALOG.filter((o) => o.id !== it.id && o.cat === it.cat);
  const pool = sameCat.length >= limit ? sameCat : CATALOG.filter((o) => o.id !== it.id);
  return pool.slice(0, limit);
}

export function sellerSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface SellerProfile extends Seller {
  slug: string;
  listings: RichListing[];
  rating: number;
}

export const SELLER_PROFILES: SellerProfile[] = (() => {
  const byName = new Map<string, SellerProfile>();
  for (const it of CATALOG) {
    const existing = byName.get(it.seller.name);
    if (existing) {
      existing.listings.push(it);
    } else {
      byName.set(it.seller.name, {
        ...it.seller,
        slug: sellerSlug(it.seller.name),
        listings: [it],
        rating: it.rating,
      });
    }
  }
  // average rating across each seller's listings
  for (const p of byName.values()) {
    p.rating = p.listings.reduce((s, l) => s + l.rating, 0) / p.listings.length;
    p.sales = p.listings.length * 6 + (p.listings[0].id % 7);
  }
  return [...byName.values()];
})();

export function getSellerBySlug(slug: string): SellerProfile | undefined {
  return SELLER_PROFILES.find((p) => p.slug === slug);
}
