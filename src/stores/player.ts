import { create } from "zustand";
import { shuffle as arrayShuffle } from "fast-shuffle";

type Playlist = {
  id: string;
  src: string;
};

interface PlayerStateProperties {
  src?: string;
  position: number;
  isPlaying: boolean;
  duration: number;
  playlists: Playlist[];
  playingIndex: number;
  currentTrackId?: string;
  isShuffle: boolean;
  shuffleIndices: number[];
}

interface PlayerStateActions {
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
  toggleShuffle: (value?: boolean, shuffleAll?: boolean) => void;
  playTrackAtIndex: (index: number) => void;
  playAtRandom: () => void;
  getCurrentIndex: () => number;
  getCurrentTrack: () => Playlist | undefined;
}

type PlayerState = PlayerStateProperties & PlayerStateActions;

const updateCurrentTrack = (state: PlayerStateProperties, index: number) => {
  const track = state.playlists[index];
  if (track) {
    return {
      playingIndex: index,
      currentTrackId: track.id,
    };
  }
  return {};
};

const shufflePlaylist = (state: PlayerState, shuffleAll: boolean) => {
  const currentTrack = state.getCurrentTrack();
  const indices = Array.from({ length: state.playlists.length }, (_, i) => i);

  if (!shuffleAll && currentTrack) {
    const currentIndex = state.playlists.findIndex(
      (track) => track.id === currentTrack.id,
    );
    indices.splice(currentIndex, 1);
    const shuffledRemaining = arrayShuffle(indices);
    shuffledRemaining.unshift(currentIndex);
    return shuffledRemaining;
  }

  return arrayShuffle(indices);
};

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
  setPlayingIndex: (index) => set(updateCurrentTrack(get(), index)),

  getCurrentTrack: () =>
    get().playlists.find((track) => track.id === get().currentTrackId),

  setPlaylists: (playlists) => {
    set({
      playlists,
      // shuffleIndices: Array.from({ length: playlists.length }, (_, i) => i),
    });
  },

  getCurrentPlaylist: () => {
    const state = get();
    return state.isShuffle
      ? state.shuffleIndices.map((index) => state.playlists[index])
      : state.playlists;
  },

  getCurrentIndex: () => {
    const state = get();
    const currentTrack = state.getCurrentTrack();
    if (!currentTrack) return 0;

    return state.isShuffle
      ? state.shuffleIndices.findIndex(
          (index) => state.playlists[index].id === currentTrack.id,
        )
      : state.playlists.findIndex((track) => track.id === currentTrack.id);
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

  toggleShuffle: (value, shuffleAll) => {
    set((state) => {
      const newShuffleState = value ?? !state.isShuffle;
      const shuffleIndices = newShuffleState
        ? shufflePlaylist(state, Boolean(shuffleAll))
        : [];

      return {
        isShuffle: newShuffleState,
        shuffleIndices,
        ...updateCurrentTrack(state, state.playingIndex),
      };
    });
  },

  playAtRandom: () =>
    get().playTrackAtIndex(Math.floor(Math.random() * get().playlists.length)),

  playTrackAtIndex: (index) => {
    const state = get();
    const track = state.getCurrentPlaylist()[index];
    if (!track) return console.warn("Invalid track index:", index);

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
    if (currentIndex < state.getCurrentPlaylist().length - 1) {
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

  hasPrev: () => get().getCurrentIndex() > 0,
  hasNext: () =>
    get().getCurrentIndex() < get().getCurrentPlaylist().length - 1,
}));