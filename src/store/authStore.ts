import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  email: string | null;
  credits: number;
  ratingsCount: number;
  isLoggedIn: boolean;
  loginAt: number | null;
  setAuth: (email: string, credits: number, ratingsCount: number) => void;
  setCredits: (credits: number) => void;
  incrementCredits: () => void;
  incrementRatingsCount: () => void;
  logout: () => void;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      credits: 0,
      ratingsCount: 0,
      isLoggedIn: false,
      loginAt: null,
      setAuth: (email, credits, ratingsCount) =>
        set({ email, credits, ratingsCount, isLoggedIn: true, loginAt: Date.now() }),
      setCredits: (credits) => set({ credits }),
      incrementCredits: () => set((s) => ({ credits: s.credits + 1 })),
      incrementRatingsCount: () => set((s) => ({ ratingsCount: s.ratingsCount + 1 })),
      logout: () =>
        set({ email: null, credits: 0, ratingsCount: 0, isLoggedIn: false, loginAt: null }),
    }),
    {
      name: "ggf-auth",
      onRehydrateStorage: () => (state) => {
        // Expire after 30 days
        if (state?.loginAt && Date.now() - state.loginAt > THIRTY_DAYS_MS) {
          state.logout();
        }
      },
    }
  )
);
