/* EverestBazar — auth store, backed by Supabase Auth (email OTP).
   The Supabase session lives in cookies (managed by @supabase/ssr); this store
   mirrors the current user + profile into a shape the UI already consumes
   (useUser / useAuthHydrated / useIsVerified). */

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { KycStatus, SessionUser } from "@/lib/types";

interface AuthState {
  user: SessionUser | null;
  hydrated: boolean;
  /** Wire up the Supabase session + auth listener (call once, after mount). */
  init: () => void;
  refresh: () => Promise<void>;
  setName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
}

let wired = false;

async function loadUser(
  set: (partial: Partial<AuthState>) => void,
  authUser: { id: string; email?: string | null } | null
) {
  if (!authUser) {
    set({ user: null, hydrated: true });
    return;
  }
  const sb = createClient();
  const { data: profile } = await sb
    .from("profiles")
    .select("name, kyc_status")
    .eq("id", authUser.id)
    .maybeSingle();
  set({
    user: {
      id: authUser.id,
      email: authUser.email ?? "",
      name: profile?.name ?? "",
      kycStatus: (profile?.kyc_status ?? "NONE") as KycStatus,
    },
    hydrated: true,
  });
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  hydrated: false,

  init: () => {
    if (wired || typeof window === "undefined") return;
    wired = true;
    const sb = createClient();
    // onAuthStateChange fires immediately with the current session (INITIAL_SESSION)
    sb.auth.onAuthStateChange((_event, session) => {
      void loadUser(set, session?.user ?? null);
    });
    // safety: if no event arrives, resolve hydration from getUser()
    sb.auth.getUser().then(({ data }) => {
      if (!get().hydrated) void loadUser(set, data.user);
    });
  },

  refresh: async () => {
    const sb = createClient();
    const { data } = await sb.auth.getUser();
    await loadUser(set, data.user);
  },

  setName: async (name) => {
    const u = get().user;
    if (!u) return;
    const sb = createClient();
    await sb.from("profiles").update({ name }).eq("id", u.id);
    set({ user: { ...u, name } });
  },

  logout: async () => {
    const sb = createClient();
    await sb.auth.signOut();
    set({ user: null });
  },
}));

/* ---- selectors (unchanged API for the UI) ---- */
export const useUser = () => useAuthStore((s) => s.user);
export const useAuthHydrated = () => useAuthStore((s) => s.hydrated);
export const useIsVerified = () =>
  useAuthStore((s) => s.user?.kycStatus === "VERIFIED");
