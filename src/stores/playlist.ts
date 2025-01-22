import { create } from "zustand";

export type PlayListStore = {
  playlist: string[];
  isPlaying: boolean;
  appendToPlaylist: (trackId: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleIsPlaying: () => void;
};

export const usePlayListStore = create<PlayListStore>((set) => {
  return {
    playlist: [],
    isPlaying: false,
    appendToPlaylist: (trackId) => {
      set((state) => ({ playlist: [...state.playlist, trackId] }));
    },
    setIsPlaying: (isPlaying) => {
      set(() => ({ isPlaying }));
    },
    toggleIsPlaying: () => {
      set((state) => ({ isPlaying: !state.isPlaying }));
    },
  };
});
