import { usePlayerStore } from "@/stores";
import { Loading } from "./components/loading";
import { usePlaylist } from "@/hooks";
import { TracksGrid } from "./components/tracks-grid";
import { useEffect, useRef, useCallback } from "react";

export function Tracks() {
  const { toggleShuffle, playTrackAtIndex, ...player } = usePlayerStore();
  const isPlaylistInitialized = useRef(false);

  const { tracksQuery, resetPlaylist } = usePlaylist();

  useEffect(() => {
    if (tracksQuery.data && !isPlaylistInitialized.current) {
      resetPlaylist();
      isPlaylistInitialized.current = tracksQuery.data.length > 0;
    }
  }, [resetPlaylist, tracksQuery.data]);

  /*
    const handleShuffle = useCallback(() => {
      updatePlaylist();
      toggleShuffle(true, true);
      playTrackAtIndex(0);
    }, [updatePlaylist, toggleShuffle, playTrackAtIndex]);
  */

  const handleTrackPlay = useCallback(
    (index: number, id: string) => {
      resetPlaylist();
      const isCurrent = id === player.currentTrackId;
      if (!isCurrent) {
        toggleShuffle(false);
        playTrackAtIndex(index);
        return;
      }
      player.toggle();
    },
    [resetPlaylist, player, toggleShuffle, playTrackAtIndex],
  );

  if (tracksQuery.isLoading) {
    return (
      <div className="px-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="py-4">
      <TracksGrid
        onTrackPlay={handleTrackPlay}
        tracks={tracksQuery.data ?? []}
      />
    </div>
  );
}
