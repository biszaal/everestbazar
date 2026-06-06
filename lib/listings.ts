/* EverestBazar — realistic Nepali secondhand listings (homepage demo data).
   prices are integer NPR. `hue` drives the geometric thumbnail tint. */

import type { Lang } from "@/lib/i18n";

export type ListingCategory =
  | "mobile"
  | "electronics"
  | "vehicles"
  | "furniture"
  | "home"
  | "fashion";

export interface DemoListing {
  id: number;
  cat: ListingCategory;
  hue: number;
  en: string;
  ne: string;
  price: number;
  loc: Record<Lang, string>;
  rating: number;
}

export const LISTINGS: DemoListing[] = [
  { id: 1, cat: "mobile", hue: 28, en: "iPhone 13 · 128GB", ne: "आइफोन १३ · १२८जीबी", price: 78000, loc: { en: "Baneshwor, KTM", ne: "बानेश्वर, काठमाडौं" }, rating: 4.9 },
  { id: 2, cat: "vehicles", hue: 50, en: "Royal Enfield Classic 350", ne: "रोयल एनफिल्ड क्लासिक ३५०", price: 425000, loc: { en: "Lakeside, Pokhara", ne: "लेकसाइड, पोखरा" }, rating: 4.8 },
  { id: 3, cat: "furniture", hue: 86, en: "Solid wood study table", ne: "काठको अध्ययन टेबल", price: 9500, loc: { en: "Patan, Lalitpur", ne: "पाटन, ललितपुर" }, rating: 5.0 },
  { id: 4, cat: "electronics", hue: 230, en: "Dell XPS 13 laptop", ne: "डेल एक्सपीएस १३ ल्यापटप", price: 92000, loc: { en: "Kupondole, LTP", ne: "कुपण्डोल, ललितपुर" }, rating: 4.7 },
  { id: 5, cat: "vehicles", hue: 28, en: "Yamaha FZ scooter", ne: "यामाहा एफजेड स्कुटर", price: 215000, loc: { en: "Maharajgunj, KTM", ne: "महाराजगन्ज, काठमाडौं" }, rating: 4.6 },
  { id: 6, cat: "furniture", hue: 50, en: "L-shaped sofa set", ne: "एल-आकारको सोफा सेट", price: 32000, loc: { en: "Bhaktapur", ne: "भक्तपुर" }, rating: 4.8 },
  { id: 7, cat: "electronics", hue: 230, en: "Sony A6400 + lens", ne: "सोनी ए६४०० + लेन्स", price: 115000, loc: { en: "Jhamsikhel, LTP", ne: "झम्सिखेल, ललितपुर" }, rating: 4.9 },
  { id: 8, cat: "home", hue: 86, en: "3-burner gas stove", ne: "३-बर्नर ग्यास चुलो", price: 4200, loc: { en: "Chabahil, KTM", ne: "चाबहिल, काठमाडौं" }, rating: 4.5 },
  { id: 9, cat: "fashion", hue: 28, en: "The North Face down jacket", ne: "नर्थ फेस डाउन ज्याकेट", price: 8800, loc: { en: "Thamel, KTM", ne: "ठमेल, काठमाडौं" }, rating: 4.7 },
  { id: 10, cat: "electronics", hue: 50, en: "PlayStation 5 + 2 pads", ne: "प्लेस्टेसन ५ + २ प्याड", price: 68000, loc: { en: "New Road, KTM", ne: "न्यू रोड, काठमाडौं" }, rating: 4.8 },
  { id: 11, cat: "vehicles", hue: 230, en: "Trek mountain bike", ne: "ट्रेक माउन्टेन बाइक", price: 46000, loc: { en: "Lakeside, Pokhara", ne: "लेकसाइड, पोखरा" }, rating: 4.9 },
  { id: 12, cat: "home", hue: 86, en: "Steel almirah · 3-door", ne: "स्टिल अल्मारी · ३-ढोका", price: 14500, loc: { en: "Koteshwor, KTM", ne: "कोटेश्वर, काठमाडौं" }, rating: 4.6 },
];

export const BROWSE_CATEGORIES: ("all" | ListingCategory)[] = [
  "all",
  "mobile",
  "electronics",
  "vehicles",
  "furniture",
  "home",
  "fashion",
];
