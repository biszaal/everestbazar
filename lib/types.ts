/* EverestBazar — shared UI types.
   (A subset of the full domain model in CLAUDE.md, enough for the Phase-1 UI.) */

export type KycStatus = "NONE" | "PENDING" | "VERIFIED" | "REJECTED";

export type Condition = "LIKE_NEW" | "GOOD" | "FAIR" | "FOR_PARTS";

export type ListingStatus = "ACTIVE" | "RESERVED" | "SOLD" | "DELETED";

export type PaymentMethod = "ESEWA" | "KHALTI";

export type TxnStatus =
  | "PENDING_PAYMENT"
  | "ESCROW_HELD"
  | "DELIVERY_CONFIRMED"
  | "COMPLETED"
  | "DISPUTED"
  | "REFUNDED"
  | "CANCELLED";

/** Authenticated user (Supabase session + profile). */
export interface SessionUser {
  id: string; // auth.users.id
  email: string;
  name: string;
  kycStatus: KycStatus;
}

/** Money rules (CLAUDE.md): buyer pays price + flat NPR 100 escrow fee. */
export const ESCROW_FEE_NPR = 100;
export const PLATFORM_FEE_RATE = 0.05;

export function buyerTotal(priceNPR: number): number {
  return priceNPR + ESCROW_FEE_NPR;
}
export function sellerPayout(priceNPR: number): number {
  return Math.round(priceNPR * (1 - PLATFORM_FEE_RATE));
}
export function platformFee(priceNPR: number): number {
  return Math.round(priceNPR * PLATFORM_FEE_RATE);
}
