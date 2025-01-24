import { create } from "zustand";

export interface PlayerState {
  src?: string;
  position?: number;
  isPlaying: boolean;
  currentTrackId?: string;

  setSrc: (
    trackId: string,
    transformToAudioSrc: (trackId: string) => string,
  ) => void;
  setPosition: (position: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;

  play: () => void;
  pause: () => void;
  toggle: () => void;
}

export const usePlayerState = create<PlayerState>((set) => {
  return {
    src: undefined,
    isPlaying: false,
    currentTrackId: undefined,

    setSrc: (trackId, transformToAudioSrc) => {
      const src = transformToAudioSrc(trackId);
      set({ src, currentTrackId: trackId });
    },

    setPosition: (position) => {
      set({ position });
    },

    setIsPlaying: (isPlaying) => {
      set({ isPlaying });
    },

    play: () => {
      set({ isPlaying: true });
    },

    pause: () => {
      set({ isPlaying: false });
    },

    toggle: () => {
      set((state) => ({ isPlaying: !state.isPlaying }));
    },
  };
});
