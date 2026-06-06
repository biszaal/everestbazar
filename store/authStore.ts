/* EverestBazar — client auth store (MOCK).
   Real auth uses phone OTP → JWT in an httpOnly cookie verified by Lambda.
   For this front-end build we simulate it: OTP "123456" signs you in, and KYC
   approval is simulated locally. State is persisted to localStorage by hand so
   the first server + client render always agree (no hydration mismatch); the
   `hydrated` flag flips true only after we read storage on mount. */

import { create } from "zustand";
import type { KycStatus, SessionUser } from "@/lib/types";

const STORAGE_KEY = "eb-auth";
export const DEMO_OTP = "123456";

interface AuthState {
  user: SessionUser | null;
  pendingPhone: string | null;
  hydrated: boolean;

  hydrate: () => void;
  startLogin: (phone: string) => void;
  verifyOtp: (otp: string) => boolean;
  setName: (name: string) => void;
  submitKyc: () => void;
  approveKyc: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  pendingPhone: null,
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) set({ user: JSON.parse(raw) as SessionUser });
    } catch {
      /* ignore corrupt storage */
    }
    set({ hydrated: true });
  },

  startLogin: (phone) => set({ pendingPhone: phone }),

  verifyOtp: (otp) => {
    if (otp !== DEMO_OTP) return false;
    const phone = get().pendingPhone ?? get().user?.phone;
    if (!phone) return false;
    const existing = get().user;
    set({
      user:
        existing && existing.phone === phone
          ? existing
          : { phone, name: "", kycStatus: "NONE" as KycStatus },
      pendingPhone: null,
    });
    return true;
  },

  setName: (name) =>
    set((s) => (s.user ? { user: { ...s.user, name } } : {})),

  submitKyc: () =>
    set((s) => (s.user ? { user: { ...s.user, kycStatus: "PENDING" } } : {})),

  approveKyc: () =>
    set((s) => (s.user ? { user: { ...s.user, kycStatus: "VERIFIED" } } : {})),

  logout: () => set({ user: null, pendingPhone: null }),
}));

// persist `user` to localStorage whenever it changes
if (typeof window !== "undefined") {
  useAuthStore.subscribe((state) => {
    try {
      if (state.user)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage full / blocked — non-fatal for the demo */
    }
  });
}

/* ---- convenience selectors ---- */
export const useUser = () => useAuthStore((s) => s.user);
export const useAuthHydrated = () => useAuthStore((s) => s.hydrated);
export const useIsVerified = () =>
  useAuthStore((s) => s.user?.kycStatus === "VERIFIED");
