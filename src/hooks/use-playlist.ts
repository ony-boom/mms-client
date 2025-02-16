import { usePlayerStore } from "@/stores";
import { useCallback, useMemo, useState } from "react";
import { useApiClient } from "@/hooks/use-api-client.ts";
import { GetTrackSortByInput, GetTrackWhereInput } from "@/api/Api.ts";

export const usePlaylist = () => {
  const { setPlaylists } = usePlayerStore();
  const [filter, setFilter] = useState<{
    query: GetTrackWhereInput;
    sort: GetTrackSortByInput;
  }>();

  const { useTracks, getTrackAudioSrc } = useApiClient();

  const tracksQuery = useTracks(filter?.query, filter?.sort);

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

  return {
    setFilter,
    playlist,
    tracksQuery,
    resetPlaylist,
  };
};
