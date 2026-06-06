"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTxnStore } from "@/store/txnStore";
import { useChatStore } from "@/store/chatStore";

/** Loads persisted client state (session, transactions, chat) once, after mount. */
export function AuthHydrator() {
  useEffect(() => {
    useAuthStore.getState().hydrate();
    useTxnStore.getState().hydrate();
    useChatStore.getState().hydrate();
  }, []);
  return null;
}
