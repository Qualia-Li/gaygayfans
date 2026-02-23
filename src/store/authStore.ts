import { create } from "zustand";

interface AuthState {
  email: string | null;
  credits: number;
  ratingsCount: number;
  isLoggedIn: boolean;
  setAuth: (email: string, credits: number, ratingsCount: number) => void;
  setCredits: (credits: number) => void;
  incrementCredits: () => void;
  incrementRatingsCount: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: null,
  credits: 0,
  ratingsCount: 0,
  isLoggedIn: false,
  setAuth: (email, credits, ratingsCount) =>
    set({ email, credits, ratingsCount, isLoggedIn: true }),
  setCredits: (credits) => set({ credits }),
  incrementCredits: () => set((s) => ({ credits: s.credits + 1 })),
  incrementRatingsCount: () => set((s) => ({ ratingsCount: s.ratingsCount + 1 })),
  logout: () => set({ email: null, credits: 0, ratingsCount: 0, isLoggedIn: false }),
}));
