import { create } from "zustand";
import { shuffle as arrayShuffle } from "fast-shuffle";

type Playlist = {
  id: string;
  src: string;
  baseIndex: number;
};

interface PlayerState {
  src?: string;
  position: number;
  isPlaying: boolean;
  duration: number;
  playlists: Playlist[];
  playingIndex: number;
  currentTrackId?: string;
  isShuffle: boolean;
  shuffleIndices: number[];

  setSrc: (src: string) => void;
  setPosition: (position: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setDuration: (duration: number) => void;
  setPlaylists: (playlists: Playlist[]) => void;
  getCurrentPlaylist: () => Playlist[];
  setPlayingIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  playNext: () => void;
  playPrev: () => void;
  hasPrev: () => boolean;
  hasNext: () => boolean;
  toggleShuffle: (value?: boolean) => void;
  playTrackAtIndex: (index: number) => void;
  playAtRandom: () => void;
  getCurrentIndex: () => number;
  getCurrentTrack: () => Playlist | undefined;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  duration: 1,
  position: 0,
  playlists: [],
  src: undefined,
  playingIndex: 0,
  isPlaying: false,
  isShuffle: false,
  currentTrackId: undefined,
  shuffleIndices: [],

  setSrc: (src) => set({ src }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlayingIndex: (index) => {
    const state = get();
    const track = state.playlists[index];
    if (track) {
      set({
        playingIndex: index,
        currentTrackId: track.id,
      });
    }
  },

  getCurrentTrack: () => {
    const state = get();
    return state.playlists.find((track) => track.id === state.currentTrackId);
  },

  setPlaylists: (playlists) => {
    const shuffleIndices = Array.from(
      { length: playlists.length },
      (_, i) => i,
    );
    const firstTrack = playlists[0];
    set({
      playlists,
      shuffleIndices,
      playingIndex: 0,
      currentTrackId: firstTrack?.id,
      src: firstTrack?.src,
      isPlaying: false,
      position: 0,
    });
  },

  getCurrentPlaylist: () => {
    const state = get();
    if (!state.isShuffle) return state.playlists;
    return state.shuffleIndices.map((index) => state.playlists[index]);
  },

  getCurrentIndex: () => {
    const state = get();
    const currentTrack = state.getCurrentTrack();
    if (!currentTrack) return 0;

    if (state.isShuffle) {
      const shuffledIndex = state.shuffleIndices.findIndex(
        (index) => state.playlists[index].id === currentTrack.id,
      );
      return shuffledIndex >= 0 ? shuffledIndex : 0;
    }

    return state.playlists.findIndex((track) => track.id === currentTrack.id);
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

  toggleShuffle: (value?: boolean) => {
    set((state) => {
      const newShuffleState = value ?? !state.isShuffle;
      const currentTrack = state.getCurrentTrack();

      if (!currentTrack) return { isShuffle: newShuffleState };

      if (newShuffleState) {
        const currentIndex = state.playlists.findIndex(
          (track) => track.id === currentTrack.id,
        );

        const indices = Array.from(
          { length: state.playlists.length },
          (_, i) => i,
        );
        indices.splice(currentIndex, 1);

        const shuffledRemaining = arrayShuffle(indices);
        shuffledRemaining.unshift(currentIndex);

        return {
          isShuffle: true,
          shuffleIndices: shuffledRemaining,
          playingIndex: currentIndex,
        };
      }

      // When disabling shuffle, find the original index of current track
      const originalIndex = state.playlists.findIndex(
        (track) => track.id === currentTrack.id,
      );

      return {
        isShuffle: false,
        playingIndex: originalIndex >= 0 ? originalIndex : 0,
        shuffleIndices: [],
      };
    });
  },

  playAtRandom: () => {
    const state = get();
    const index = Math.floor(Math.random() * state.playlists.length);
    get().playTrackAtIndex(index);
  },

  playTrackAtIndex: (index) => {
    const state = get();
    const playlist = state.getCurrentPlaylist();
    const track = playlist[index];

    if (!track) {
      console.warn("Invalid track index:", index);
      return;
    }

    const actualTrack = state.playlists.find((t) => t.id === track.id);
    if (!actualTrack) return;

    set({
      playingIndex: state.playlists.indexOf(actualTrack),
      currentTrackId: actualTrack.id,
      src: actualTrack.src,
      isPlaying: true,
      position: 0,
    });
  },

  playNext: () => {
    const state = get();
    const currentIndex = state.getCurrentIndex();
    const maxIndex = state.getCurrentPlaylist().length - 1;

    if (currentIndex < maxIndex) {
      state.playTrackAtIndex(currentIndex + 1);
    }
  },

  playPrev: () => {
    const state = get();
    const currentIndex = state.getCurrentIndex();

    if (currentIndex > 0) {
      state.playTrackAtIndex(currentIndex - 1);
    }
  },

  hasPrev: () => {
    const state = get();
    return state.getCurrentIndex() > 0;
  },

  hasNext: () => {
    const state = get();
    const currentIndex = state.getCurrentIndex();
    return currentIndex < state.getCurrentPlaylist().length - 1;
  },
}));
