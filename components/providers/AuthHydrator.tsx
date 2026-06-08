"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/** Wires up the Supabase auth session listener once, after mount. */
export function AuthHydrator() {
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);
  return null;
}
