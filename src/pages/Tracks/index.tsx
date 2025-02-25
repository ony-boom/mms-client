import { usePlayerStore } from "@/stores";
import { Loading } from "./components/loading";
import { usePlaylist } from "@/hooks";
import { TracksGrid } from "./components/tracks-grid";
import { useCallback } from "react";
import { Extra, GlobalSearch } from "@/components";

export function Tracks() {
  const { toggleShuffle, playTrackAtIndex, ...player } = usePlayerStore();

  const { tracksQuery, resetPlaylist } = usePlaylist();

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
    <>
      <GlobalSearch />
      <Extra />
      <TracksGrid
        onTrackPlay={handleTrackPlay}
        tracks={tracksQuery.data ?? []}
      />
    </>
  );
}
