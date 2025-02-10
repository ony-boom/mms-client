import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { LoadedTracks, LyricsResponse, SortOrder, Track, TrackSortField } from "@/api/types.ts";

export type GetTrackWhereInput = {
  id?: string;
  title?: string;
  artistName?: string;
  albumTitle?: string;
};

export type GetTrackSortByInput = {
  field: TrackSortField;
  order: SortOrder;
};

export interface Api {
  useTracks: (
    where?: GetTrackWhereInput,
    sortBy?: GetTrackSortByInput,
  ) => UseQueryResult<Track[]>;

  useLoadTracks: () => UseMutationResult<boolean>;
  useTrackLyrics: (trackId: string) => UseQueryResult<LyricsResponse>;

  getTrackCoverSrc: (trackId: string) => string;
  getTrackAudioSrc: (trackIds: string[]) => string[];
  useTrackLoadEvent: (debounce?: number) => LoadedTracks;
}
