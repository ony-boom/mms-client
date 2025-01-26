import { create } from "zustand";

export interface PlayerState {
  src?: string;
  position: number;
  isPlaying: boolean;
  duration: number;
  playlists: {
    id: string;
    src: string;
  }[];

  playingIndex: number;
  currentTrackId?: string;

  setSrc: (trackId: string) => void;
  setPosition: (position: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setDuration: (duration: number) => void;
  setPlaylists: (playlists: { id: string; src: string }[]) => void;

  play: () => void;
  pause: () => void;
  toggle: () => void;
  playNext: () => void;
  playPrev: () => void;
  playTrackAtIndex: (index: number) => void;
}

export const usePlayerState = create<PlayerState>((set, get) => {
  return {
    duration: 1,
    position: 0,
    playlists: [],
    src: undefined,
    playingIndex: 0,
    isPlaying: false,
    currentTrackId: undefined,

    setSrc: (src) => {
      set({ src });
    },

    setPosition: (position) => {
      set({ position });
    },

    setDuration: (duration) => {
      set({ duration });
    },

    setIsPlaying: (isPlaying) => {
      set({ isPlaying });
    },

    setPlaylists: (playlists) => {
      set({ playlists });
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

    playTrackAtIndex: (index) => {
      set({ playingIndex: index });
      get().setSrc(get().playlists[index].src);
      set({ currentTrackId: get().playlists[index].id });
      set({ isPlaying: true });
    },

    playNext: () => {
      const nextIndex = get().playingIndex + 1;
      if (nextIndex >= get().playlists.length) {
        return;
      }
      get().playTrackAtIndex(nextIndex);
    },

    playPrev: () => {
      const prevIndex = get().playingIndex - 1;
      if (prevIndex < 0) {
        return;
      }
      get().playTrackAtIndex(prevIndex);
    },
  };
});
