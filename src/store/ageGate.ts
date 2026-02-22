import { create } from "zustand";

interface AgeGateState {
  verified: boolean;
  setVerified: (v: boolean) => void;
}

export const useAgeGate = create<AgeGateState>((set) => ({
  verified: false,
  setVerified: (v) => set({ verified: v }),
}));
