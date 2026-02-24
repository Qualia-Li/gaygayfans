import { create } from "zustand";

interface FeedState {
  currentVideoId: string | null;
  setCurrentVideoId: (id: string) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  currentVideoId: null,
  setCurrentVideoId: (id) => set({ currentVideoId: id }),
}));
