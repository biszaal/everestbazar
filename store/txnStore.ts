/* EverestBazar — escrow transactions store (MOCK).
   Real data lives in DynamoDB via Lambda; here we seed a believable history and
   append real orders made through checkout. Persisted to localStorage. */

import { create } from "zustand";
import { buyerTotal, sellerPayout, type PaymentMethod, type TxnStatus } from "@/lib/types";
import { getListing } from "@/lib/catalog";

const STORAGE_KEY = "eb-txns";

export type TxnRole = "buyer" | "seller";

export interface Txn {
  id: string;
  listingId: number;
  titleEn: string;
  titleNe: string;
  hue: number;
  priceNPR: number;
  role: TxnRole;
  counterpart: string;
  status: TxnStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  escrowDeadline: string;
  reviewed?: boolean;
}

interface TxnState {
  txns: Txn[];
  hydrated: boolean;
  hydrate: () => void;
  addPurchase: (listingId: number, payment: PaymentMethod) => string | null;
  confirm: (id: string) => void;
  dispute: (id: string) => void;
  markReviewed: (id: string) => void;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const hoursAhead = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

function snap(listingId: number) {
  const l = getListing(listingId);
  return {
    listingId,
    titleEn: l?.en ?? "Item",
    titleNe: l?.ne ?? "सामान",
    hue: l?.hue ?? 28,
    priceNPR: l?.price ?? 0,
    seller: l?.seller.name ?? "Seller",
  };
}

function seed(): Txn[] {
  const mk = (
    id: string,
    listingId: number,
    role: TxnRole,
    counterpart: string,
    status: TxnStatus,
    createdH: number,
    extra: Partial<Txn> = {}
  ): Txn => {
    const s = snap(listingId);
    return {
      id,
      listingId,
      titleEn: s.titleEn,
      titleNe: s.titleNe,
      hue: s.hue,
      priceNPR: s.priceNPR,
      role,
      counterpart,
      status,
      createdAt: hoursAgo(createdH),
      escrowDeadline: hoursAhead(72 - createdH),
      ...extra,
    };
  };
  return [
    mk("t-1004", 4, "buyer", snap(4).seller, "ESCROW_HELD", 30, { paymentMethod: "ESEWA" }),
    mk("t-1009", 9, "buyer", snap(9).seller, "COMPLETED", 240, { paymentMethod: "KHALTI" }),
    mk("t-1008", 8, "buyer", snap(8).seller, "DISPUTED", 80, { paymentMethod: "ESEWA" }),
    mk("t-2003", 3, "seller", "Manish Pradhan", "ESCROW_HELD", 18, { paymentMethod: "KHALTI" }),
    mk("t-2012", 12, "seller", "Rekha Bhandari", "COMPLETED", 400, { paymentMethod: "ESEWA" }),
  ];
}

export const useTxnStore = create<TxnState>((set, get) => ({
  txns: [],
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    let txns: Txn[] | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) txns = JSON.parse(raw) as Txn[];
    } catch {
      /* ignore */
    }
    set({ txns: txns ?? seed(), hydrated: true });
  },

  addPurchase: (listingId, payment) => {
    const l = getListing(listingId);
    if (!l) return null;
    const id = `t-${Date.now().toString(36)}`;
    const txn: Txn = {
      id,
      listingId,
      titleEn: l.en,
      titleNe: l.ne,
      hue: l.hue,
      priceNPR: l.price,
      role: "buyer",
      counterpart: l.seller.name,
      status: "ESCROW_HELD",
      paymentMethod: payment,
      createdAt: new Date().toISOString(),
      escrowDeadline: hoursAhead(72),
    };
    set((s) => ({ txns: [txn, ...s.txns] }));
    return id;
  },

  confirm: (id) =>
    set((s) => ({
      txns: s.txns.map((t) => (t.id === id ? { ...t, status: "COMPLETED" } : t)),
    })),

  dispute: (id) =>
    set((s) => ({
      txns: s.txns.map((t) => (t.id === id ? { ...t, status: "DISPUTED" } : t)),
    })),

  markReviewed: (id) =>
    set((s) => ({
      txns: s.txns.map((t) => (t.id === id ? { ...t, reviewed: true } : t)),
    })),
}));

if (typeof window !== "undefined") {
  useTxnStore.subscribe((state) => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.txns));
    } catch {
      /* ignore */
    }
  });
}

export const useTxnHydrated = () => useTxnStore((s) => s.hydrated);

/** Money helpers re-exported for convenience in dashboards. */
export { buyerTotal, sellerPayout };
