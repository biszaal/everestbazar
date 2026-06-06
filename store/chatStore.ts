/* EverestBazar — chat store (MOCK).
   Real chat is an API Gateway WebSocket backed by Lambda. Here messages live in
   localStorage and a canned reply is simulated in the thread component.
   Contact-sharing is blocked per CLAUDE.md and replaced with a system message. */

import { create } from "zustand";

const STORAGE_KEY = "eb-chat";

export type MsgType = "TEXT" | "OFFER" | "SYSTEM";
export type OfferStatus = "pending" | "accepted" | "declined";

export interface ChatMsg {
  id: string;
  sender: "me" | "them" | "system";
  type: MsgType;
  text: string;
  offerNPR?: number;
  offerStatus?: OfferStatus;
  ts: string;
}

export interface Convo {
  id: string;
  name: string;
  verified: boolean;
  listingId?: number;
  listingTitleEn?: string;
  listingTitleNe?: string;
  hue?: number;
  lastTs: string;
}

// blocks phone numbers (incl. +977) and emails
const CONTACT_RE = /(\+977[\d\s-]{8,}|\b\d{10}\b|[\w.]+@[\w.]+\.\w+)/;

interface ChatState {
  convos: Convo[];
  messages: Record<string, ChatMsg[]>;
  hydrated: boolean;
  hydrate: () => void;
  send: (chatId: string, text: string) => { blocked: boolean };
  pushReply: (chatId: string, text: string) => void;
  sendOffer: (chatId: string, amount: number) => void;
  respondOffer: (chatId: string, msgId: string, accept: boolean) => void;
  openOrCreate: (c: Omit<Convo, "lastTs">, greeting: string) => string;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const mid = () => `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

function seed(): Pick<ChatState, "convos" | "messages"> {
  const convos: Convo[] = [
    {
      id: "l7",
      name: "Anjali Rai",
      verified: true,
      listingId: 7,
      listingTitleEn: "Sony A6400 + lens",
      listingTitleNe: "सोनी ए६४०० + लेन्स",
      hue: 230,
      lastTs: hoursAgo(2),
    },
    {
      id: "buyer-ramesh",
      name: "Ramesh Karki",
      verified: true,
      listingId: 3,
      listingTitleEn: "Solid wood study table",
      listingTitleNe: "काठको अध्ययन टेबल",
      hue: 86,
      lastTs: hoursAgo(20),
    },
  ];
  const messages: Record<string, ChatMsg[]> = {
    l7: [
      { id: "s1", sender: "them", type: "TEXT", text: "Hi! Yes, the camera is still available. It comes with the 16-50mm kit lens.", ts: hoursAgo(5) },
      { id: "s2", sender: "me", type: "TEXT", text: "Great. Roughly how many shutter actuations?", ts: hoursAgo(4) },
      { id: "s3", sender: "them", type: "TEXT", text: "Around 12k. I can show you on a video call before you pay through escrow.", ts: hoursAgo(2) },
    ],
    "buyer-ramesh": [
      { id: "s4", sender: "them", type: "TEXT", text: "Is the study table still up for grabs?", ts: hoursAgo(22) },
      { id: "s5", sender: "them", type: "OFFER", text: "Made an offer", offerNPR: 8500, offerStatus: "pending", ts: hoursAgo(20) },
    ],
  };
  return { convos, messages };
}

export const useChatStore = create<ChatState>((set, get) => ({
  convos: [],
  messages: {},
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Pick<ChatState, "convos" | "messages">;
        set({ convos: parsed.convos, messages: parsed.messages, hydrated: true });
        return;
      }
    } catch {
      /* ignore */
    }
    const s = seed();
    set({ convos: s.convos, messages: s.messages, hydrated: true });
  },

  send: (chatId, text) => {
    const blocked = CONTACT_RE.test(text);
    const now = new Date().toISOString();
    const msg: ChatMsg = blocked
      ? { id: mid(), sender: "system", type: "SYSTEM", text: "__BLOCKED__", ts: now }
      : { id: mid(), sender: "me", type: "TEXT", text, ts: now };
    set((s) => ({
      messages: { ...s.messages, [chatId]: [...(s.messages[chatId] ?? []), msg] },
      convos: s.convos.map((c) => (c.id === chatId ? { ...c, lastTs: now } : c)),
    }));
    return { blocked };
  },

  pushReply: (chatId, text) => {
    const now = new Date().toISOString();
    const msg: ChatMsg = { id: mid(), sender: "them", type: "TEXT", text, ts: now };
    set((s) => ({
      messages: { ...s.messages, [chatId]: [...(s.messages[chatId] ?? []), msg] },
      convos: s.convos.map((c) => (c.id === chatId ? { ...c, lastTs: now } : c)),
    }));
  },

  sendOffer: (chatId, amount) => {
    const now = new Date().toISOString();
    const msg: ChatMsg = {
      id: mid(),
      sender: "me",
      type: "OFFER",
      text: "Made an offer",
      offerNPR: amount,
      offerStatus: "pending",
      ts: now,
    };
    set((s) => ({
      messages: { ...s.messages, [chatId]: [...(s.messages[chatId] ?? []), msg] },
      convos: s.convos.map((c) => (c.id === chatId ? { ...c, lastTs: now } : c)),
    }));
  },

  respondOffer: (chatId, msgId, accept) => {
    const now = new Date().toISOString();
    set((s) => {
      const list = (s.messages[chatId] ?? []).map((m) =>
        m.id === msgId ? { ...m, offerStatus: (accept ? "accepted" : "declined") as OfferStatus } : m
      );
      const sys: ChatMsg = {
        id: mid(),
        sender: "system",
        type: "SYSTEM",
        text: accept ? "__OFFER_ACCEPTED__" : "__OFFER_DECLINED__",
        ts: now,
      };
      return { messages: { ...s.messages, [chatId]: [...list, sys] } };
    });
  },

  openOrCreate: (c, greeting) => {
    const exists = get().convos.find((x) => x.id === c.id);
    const now = new Date().toISOString();
    if (!exists) {
      set((s) => ({
        convos: [{ ...c, lastTs: now }, ...s.convos],
        messages: {
          ...s.messages,
          [c.id]: [{ id: mid(), sender: "them", type: "TEXT", text: greeting, ts: now }],
        },
      }));
    }
    return c.id;
  },
}));

if (typeof window !== "undefined") {
  useChatStore.subscribe((state) => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ convos: state.convos, messages: state.messages })
      );
    } catch {
      /* ignore */
    }
  });
}

export const useChatHydrated = () => useChatStore((s) => s.hydrated);
export const useUnreadCount = () => 0; // simplified for the demo
