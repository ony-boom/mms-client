import { create } from "zustand";
import { shuffle as arrayShuffle } from "fast-shuffle";
import { persist } from "zustand/middleware";
import { createDebouncedStorage } from "@/stores/player/storage.ts";
import { PlayerState, PlayerStateProperties } from "./types";

const updateCurrentTrack = (state: PlayerStateProperties, index: number) => {
  const trackId = state.isShuffle
    ? state.shuffleOrder[index]
    : state.playlistOrder[index];
  const trackSrc = state.playlists.get(trackId);
  if (trackSrc) {
    return {
      playingIndex: index,
      currentTrackId: trackId,
      src: trackSrc,
    };
  }
  return {};
};

const shufflePlaylist = (state: PlayerState, shuffleAll: boolean) => {
  const currentTrackId = state.currentTrackId;
  const trackIds = [...state.playlistOrder];

  if (!shuffleAll && currentTrackId) {
    const currentIndex = trackIds.indexOf(currentTrackId);
    trackIds.splice(currentIndex, 1);
    const shuffledRemaining = arrayShuffle(trackIds);
    shuffledRemaining.unshift(currentTrackId);
    return shuffledRemaining;
  }

  return arrayShuffle(trackIds);
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      duration: 1,
      position: 0,
      playlists: new Map(),
      playlistOrder: [],
      src: undefined,
      playingIndex: 0,
      isPlaying: false,
      isShuffle: false,
      currentTrackId: undefined,
      shuffleOrder: [],

      setSrc: (src) => set({ src }),
      setPosition: (position) => set({ position }),
      setDuration: (duration) => set({ duration }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setPlayingIndex: (index) => set(updateCurrentTrack(get(), index)),

      getCurrentTrack: () => {
        const state = get();
        return state.currentTrackId
          ? {
              id: state.currentTrackId,
              src: state.playlists.get(state.currentTrackId)!,
            }
          : undefined;
      },

      setPlaylists: (playlists) => {
        const playlistMap = new Map(
          playlists.map((track) => [track.id, track.src]),
        );
        const playlistOrder = playlists.map((track) => track.id);
        set({
          playlists: playlistMap,
          playlistOrder,
        });
      },

      getCurrentPlaylist: () => {
        const state = get();
        const order = state.isShuffle
          ? state.shuffleOrder
          : state.playlistOrder;
        return order.map((id) => ({
          id,
          src: state.playlists.get(id)!,
        }));
      },

      getCurrentIndex: () => {
        const state = get();
        const currentTrackId = state.currentTrackId;
        if (!currentTrackId) return 0;

        const order = state.isShuffle
          ? state.shuffleOrder
          : state.playlistOrder;
        return order.indexOf(currentTrackId);
      },

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

      toggleShuffle: (value, shuffleAll) => {
        set((state) => {
          const newShuffleState = value ?? !state.isShuffle;
          const shuffleOrder = newShuffleState
            ? shufflePlaylist(state, Boolean(shuffleAll))
            : [];

          return {
            isShuffle: newShuffleState,
            shuffleOrder,
          };
        });
      },

      playAtRandom: () => {
        const state = get();
        const order = state.isShuffle
          ? state.shuffleOrder
          : state.playlistOrder;
        const randomIndex = Math.floor(Math.random() * order.length);
        state.playTrackAtIndex(randomIndex);
      },

      playAfter: (id, src) => {
        const state = get();
        const currentPlaylistOrder = state.isShuffle
          ? state.shuffleOrder
          : state.playlistOrder;
        const currentIndex = state.getCurrentIndex();

        const sourceIndex = currentPlaylistOrder.indexOf(id);

        if (sourceIndex === currentIndex) return;

        const newPlaylistOrder = structuredClone(currentPlaylistOrder);

        if (sourceIndex === -1 && src) {
          set({ playlists: new Map([...state.playlists, [id, src]]) });
          newPlaylistOrder.splice(currentIndex + 1, 0, id);
        } else {
          const [removedId] = newPlaylistOrder.splice(sourceIndex, 1);
          newPlaylistOrder.splice(currentIndex + 1, 0, removedId);
        }

        if (state.isShuffle) {
          set({ shuffleOrder: newPlaylistOrder });
        } else {
          set({ playlistOrder: newPlaylistOrder });
        }
      },

      playTrackAtIndex: (index) => {
        const state = get();
        const order = state.isShuffle
          ? state.shuffleOrder
          : state.playlistOrder;
        const trackId = order[index];
        const trackSrc = state.playlists.get(trackId);
        if (!trackSrc) return console.warn("Invalid track index:", index);

        set({
          playingIndex: index,
          currentTrackId: trackId,
          src: trackSrc,
          isPlaying: true,
          position: 0,
        });
      },

      playNext: () => {
        const state = get();
        const currentIndex = state.getCurrentIndex();
        const order = state.isShuffle
          ? state.shuffleOrder
          : state.playlistOrder;
        if (currentIndex < order.length - 1) {
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
      hasNext: () => {
        const state = get();
        const order = state.isShuffle
          ? state.shuffleOrder
          : state.playlistOrder;
        return state.getCurrentIndex() < order.length - 1;
      },
    }),
    {
      name: "player-state",
      partialize: (state) => {
        return {
          src: state.src,
          position: state.position,
          currentTrackId: state.currentTrackId,
          isShuffle: state.isShuffle,
          shuffleOrder: state.shuffleOrder,
          playlists: state.playlists,
          duration: state.duration,
          playlistOrder: state.playlistOrder,
          playingIndex: state.playingIndex,
        } as PlayerState;
      },
      storage: createDebouncedStorage(),
    },
  ),
);
