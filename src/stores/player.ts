import { create } from "zustand";
import { shuffle as arrayShuffle } from "fast-shuffle";

type Playlist = {
  id: string;
  src: string;
};

export interface PlayerState {
  src?: string;
  position: number;
  isPlaying: boolean;
  duration: number;
  isShuffle: boolean;
  playlists: Playlist[];
  shuffledPlaylists: Playlist[];

  playingIndex: number;
  currentTrackId?: string;

  setSrc: (trackId: string) => void;
  setPosition: (position: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setDuration: (duration: number) => void;
  setPlaylists: (playlists: Playlist[]) => void;
  getCurrentPlaylist: () => Playlist[];

  play: () => void;
  pause: () => void;
  toggle: () => void;
  playNext: () => void;
  playPrev: () => void;
  hasPrev: () => boolean;
  hasNext: () => boolean;
  toggleShuffle: (value?: boolean) => void;
  playTrackAtIndex: (index: number) => void;
}

export const usePlayerState = create<PlayerState>((set, get) => {
  return {
    duration: 1,
    position: 0,
    playlists: [],
    shuffledPlaylists: [],
    src: undefined,
    playingIndex: 0,
    isPlaying: false,
    isShuffle: false,
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

    toggleShuffle: (value) => {
      set((state) => {
        const baseValue = value ?? !state.isShuffle;

        if (baseValue) {
          const shuffledPlaylists = arrayShuffle(state.playlists);
          return { isShuffle: baseValue, shuffledPlaylists };
        }

        return { isShuffle: baseValue, shuffledPlaylists: [] };
      });
    },

    getCurrentPlaylist() {
      return get().isShuffle ? get().shuffledPlaylists : get().playlists;
    },

    playTrackAtIndex: (index) => {
      set({ playingIndex: index });
      const playlist = get().getCurrentPlaylist();

      get().setSrc(playlist[index].src);
      set({ currentTrackId: playlist[index].id });
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

    hasPrev: () => {
      return get().playingIndex > 0;
    },

    hasNext: () => {
      return get().playingIndex < get().getCurrentPlaylist().length - 1;
    },
  };
});
