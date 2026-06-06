/* EverestBazar — demo reviews (mock). */

import type { Bilingual } from "@/lib/i18n";

export interface Review {
  reviewer: string;
  rating: number;
  comment: Bilingual;
  ts: string;
}

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const DEMO_REVIEWS: Review[] = [
  {
    reviewer: "Manish Pradhan",
    rating: 5,
    comment: {
      en: "Exactly as described. Met at a café in Jhamsikhel, checked everything, released escrow on the spot. Smooth.",
      ne: "वर्णनअनुसारकै। झम्सिखेलको क्याफेमा भेटेर सबै जाँचेपछि एस्क्रो जारी गरें। सहज भयो।",
    },
    ts: daysAgo(6),
  },
  {
    reviewer: "Rekha Bhandari",
    rating: 5,
    comment: {
      en: "Patient with all my questions and never pushed for off-platform payment. Would buy again.",
      ne: "मेरा सबै प्रश्नमा धैर्यवान् रहे, बाहिर भुक्तानीको दबाब दिएनन्। फेरि किन्छु।",
    },
    ts: daysAgo(19),
  },
  {
    reviewer: "Sworup Lama",
    rating: 4,
    comment: {
      en: "Item was good. Delivery took a day longer than planned but communication was clear throughout.",
      ne: "सामान राम्रो थियो। डेलिभरी एक दिन ढिलो भयो तर सञ्चार स्पष्ट रह्यो।",
    },
    ts: daysAgo(33),
  },
];

export function reviewsFor(seed: number, count = 3): Review[] {
  const start = seed % DEMO_REVIEWS.length;
  return Array.from({ length: Math.min(count, DEMO_REVIEWS.length) }, (_, i) =>
    DEMO_REVIEWS[(start + i) % DEMO_REVIEWS.length]
  );
}
