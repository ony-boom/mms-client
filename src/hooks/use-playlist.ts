import { useFilterStore, usePlayerStore } from "@/stores";
import { useApiClient } from "@/hooks/use-api-client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDebounce } from "./use-debounce";

export const usePlaylist = () => {
  const { setPlaylists } = usePlayerStore();
  const { sort, query } = useFilterStore();

  const isPlaylistInitialized = useRef(false);

  const { useTracks, getTrackAudioSrc } = useApiClient();

  const debouncedQuery = useDebounce(query, 500);

  const tracksQuery = useTracks(debouncedQuery, sort);

  const playlist = useMemo(
    () =>
      tracksQuery.data?.map((track) => ({
        id: track.id,
        src: getTrackAudioSrc([track.id])[0],
      })),
    [tracksQuery.data, getTrackAudioSrc],
  );

  const resetPlaylist = useCallback(() => {
    if (playlist) {
      setPlaylists(playlist);
    }
  }, [playlist, setPlaylists]);

  useEffect(() => {
    if (tracksQuery.data && !isPlaylistInitialized.current) {
      resetPlaylist();
      isPlaylistInitialized.current = tracksQuery.data.length > 0;
    }
  }, [resetPlaylist, tracksQuery.data]);

  return {
    playlist,
    tracksQuery,
    resetPlaylist,
  };
};
