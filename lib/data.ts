/* Supabase data access. Functions take a SupabaseClient so they work with both
   the browser client (Client Components) and the server client (RSC/routes). */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  adaptListing,
  adaptSeller,
  publicPhotoUrl,
  toSeed,
  type UiListing,
  type UiSeller,
} from "@/lib/adapters";
import type { PaymentMethod, TxnStatus } from "@/lib/types";

// only public-safe seller columns — never nid_hash/phone/email/kyc paths
const SELLER_PUBLIC = "id, name, trust_score, kyc_status, avg_rating, completed_sales, created_at";
const LISTING_SELECT = `*, profiles:seller_id (${SELLER_PUBLIC})`;

export async function getActiveListings(sb: SupabaseClient): Promise<UiListing[]> {
  const { data, error } = await sb
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(adaptListing);
}

export async function getListingById(
  sb: SupabaseClient,
  id: string
): Promise<UiListing | null> {
  const { data, error } = await sb
    .from("listings")
    .select(LISTING_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return adaptListing(data);
}

export async function getSellerListings(
  sb: SupabaseClient,
  sellerId: string
): Promise<UiListing[]> {
  const { data } = await sb
    .from("listings")
    .select(LISTING_SELECT)
    .eq("seller_id", sellerId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false });
  return (data ?? []).map(adaptListing);
}

export async function getSellerById(
  sb: SupabaseClient,
  id: string
): Promise<UiSeller | null> {
  const { data } = await sb.from("profiles").select(SELLER_PUBLIC).eq("id", id).maybeSingle();
  return data ? adaptSeller(data) : null;
}

export async function getRelatedListings(
  sb: SupabaseClient,
  listing: UiListing
): Promise<UiListing[]> {
  const all = await getActiveListings(sb);
  const same = all.filter((l) => l.id !== listing.id && l.cat === listing.cat);
  const pool = same.length ? same : all.filter((l) => l.id !== listing.id);
  return pool.slice(0, 4);
}

/* ---- transactions (purchases / sales dashboards) ---- */

export interface MyTxn {
  id: string;
  listingId: string;
  titleEn: string;
  titleNe: string;
  hue: number;
  priceNPR: number;
  role: "buyer" | "seller";
  counterpart: string;
  status: TxnStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  escrowDeadline: string | null;
  coverUrl?: string;
}

interface TxnRowJoined {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  price_npr: number;
  status: TxnStatus;
  payment_method: PaymentMethod | null;
  created_at: string;
  escrow_deadline: string | null;
  listing: { title: string | null; photo_paths: string[] | null } | null;
  buyer: { name: string | null } | null;
  seller: { name: string | null } | null;
}

const TXN_SELECT =
  "id, buyer_id, seller_id, listing_id, price_npr, status, payment_method, created_at, escrow_deadline, " +
  "listing:listing_id ( title, photo_paths ), buyer:buyer_id ( name ), seller:seller_id ( name )";

function adaptTxn(row: TxnRowJoined, uid: string): MyTxn {
  const role: "buyer" | "seller" = row.buyer_id === uid ? "buyer" : "seller";
  const cover = row.listing?.photo_paths?.[0];
  const title = row.listing?.title ?? "Item";
  return {
    id: row.id,
    listingId: row.listing_id,
    titleEn: title,
    titleNe: title,
    hue: toSeed(row.listing_id) % 360,
    priceNPR: row.price_npr,
    role,
    counterpart: (role === "buyer" ? row.seller?.name : row.buyer?.name) ?? "User",
    status: row.status,
    paymentMethod: row.payment_method ?? undefined,
    createdAt: row.created_at,
    escrowDeadline: row.escrow_deadline,
    coverUrl: cover ? publicPhotoUrl(cover) : undefined,
  };
}

// RLS already restricts rows to the caller (buyer or seller).
export async function getMyTransactions(sb: SupabaseClient, userId: string): Promise<MyTxn[]> {
  const { data, error } = await sb
    .from("transactions")
    .select(TXN_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as TxnRowJoined[]).map((r) => adaptTxn(r, userId));
}

export async function getTransaction(
  sb: SupabaseClient,
  id: string,
  userId: string
): Promise<MyTxn | null> {
  const { data } = await sb.from("transactions").select(TXN_SELECT).eq("id", id).maybeSingle();
  return data ? adaptTxn(data as unknown as TxnRowJoined, userId) : null;
}

/* ---- chat (Supabase Realtime) ---- */

export interface ChatConvo {
  id: string;
  name: string;
  verified: boolean;
  listingId: string | null;
  listingTitle: string | null;
  hue: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them" | "system";
  type: "TEXT" | "OFFER" | "SYSTEM";
  text: string;
  offerNPR: number | null;
  ts: string;
}

// blocks phone numbers (incl. +977) and emails — keep deals on-platform
const CONTACT_RE = /(\+977[\d\s-]{8,}|\b\d{10}\b|[\w.]+@[\w.]+\.\w+)/;

interface ConvoRow {
  id: string;
  listing_id: string | null;
  buyer_id: string;
  seller_id: string;
  last_message: string | null;
  last_message_at: string | null;
  listing: { title: string | null } | null;
  buyer: { name: string | null; kyc_status: string } | null;
  seller: { name: string | null; kyc_status: string } | null;
}

const CONVO_SELECT =
  "id, listing_id, buyer_id, seller_id, last_message, last_message_at, " +
  "listing:listing_id ( title ), buyer:buyer_id ( name, kyc_status ), seller:seller_id ( name, kyc_status )";

function adaptConvo(row: ConvoRow, uid: string): ChatConvo {
  const other = row.buyer_id === uid ? row.seller : row.buyer;
  return {
    id: row.id,
    name: other?.name ?? "User",
    verified: other?.kyc_status === "VERIFIED",
    listingId: row.listing_id,
    listingTitle: row.listing?.title ?? null,
    hue: row.listing_id ? toSeed(row.listing_id) % 360 : 28,
    lastMessage: row.last_message,
    lastMessageAt: row.last_message_at,
  };
}

interface MessageRow {
  id: string;
  sender_id: string;
  content: string;
  type: "TEXT" | "OFFER" | "SYSTEM";
  offer_amount_npr: number | null;
  created_at: string;
}

export function adaptMessage(row: MessageRow, uid: string): ChatMessage {
  return {
    id: row.id,
    sender: row.type === "SYSTEM" ? "system" : row.sender_id === uid ? "me" : "them",
    type: row.type,
    text: row.content,
    offerNPR: row.offer_amount_npr,
    ts: row.created_at,
  };
}

export async function getConversations(sb: SupabaseClient, uid: string): Promise<ChatConvo[]> {
  const { data } = await sb
    .from("conversations")
    .select(CONVO_SELECT)
    .order("last_message_at", { ascending: false, nullsFirst: false });
  return ((data ?? []) as unknown as ConvoRow[]).map((r) => adaptConvo(r, uid));
}

export async function getConversation(
  sb: SupabaseClient,
  id: string,
  uid: string
): Promise<ChatConvo | null> {
  const { data } = await sb.from("conversations").select(CONVO_SELECT).eq("id", id).maybeSingle();
  return data ? adaptConvo(data as unknown as ConvoRow, uid) : null;
}

export async function getMessages(sb: SupabaseClient, convId: string, uid: string): Promise<ChatMessage[]> {
  const { data } = await sb
    .from("messages")
    .select("id, sender_id, content, type, offer_amount_npr, created_at")
    .eq("conversation_id", convId)
    .order("created_at", { ascending: true });
  return ((data ?? []) as unknown as MessageRow[]).map((r) => adaptMessage(r, uid));
}

/** Find-or-create a conversation for (listing, buyer=me, seller). Returns its id. */
export async function openConversation(
  sb: SupabaseClient,
  listingId: string,
  sellerId: string,
  uid: string
): Promise<string | null> {
  const { data: existing } = await sb
    .from("conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", uid)
    .eq("seller_id", sellerId)
    .maybeSingle();
  if (existing) return existing.id;
  const { data, error } = await sb
    .from("conversations")
    .insert({ listing_id: listingId, buyer_id: uid, seller_id: sellerId })
    .select("id")
    .single();
  if (error) return null;
  return data.id;
}

export async function sendMessage(
  sb: SupabaseClient,
  convId: string,
  content: string,
  uid: string
): Promise<{ blocked: boolean }> {
  const blocked = CONTACT_RE.test(content);
  await sb.from("messages").insert({
    conversation_id: convId,
    sender_id: uid,
    content: blocked ? "__BLOCKED__" : content,
    type: blocked ? "SYSTEM" : "TEXT",
  });
  await sb
    .from("conversations")
    .update({ last_message: blocked ? "[contact blocked]" : content, last_message_at: new Date().toISOString() })
    .eq("id", convId);
  return { blocked };
}

export async function sendOffer(sb: SupabaseClient, convId: string, amount: number, uid: string): Promise<void> {
  await sb.from("messages").insert({
    conversation_id: convId,
    sender_id: uid,
    content: "Made an offer",
    type: "OFFER",
    offer_amount_npr: amount,
    offer_status: "PENDING",
  });
  await sb
    .from("conversations")
    .update({ last_message: `Offer: NPR ${amount}`, last_message_at: new Date().toISOString() })
    .eq("id", convId);
}
