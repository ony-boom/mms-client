import { SortOrder, Track, TrackSortField } from "@/api/types.ts";

export type GetTrackWhereInput = {
  id: string;
  title?: string;
  artistName?: string;
  albumTitle?: string;
};

export type GetTrackSortByInput = {
  field: TrackSortField;
  order: SortOrder;
};

export type ApiBaseReturnType<T, E = unknown> = {
  data: T | null;
  errors: E | null;
  loading: boolean;
};

export interface Api {
  useTracks: (
    where?: GetTrackWhereInput,
    sortBy?: GetTrackSortByInput,
  ) => ApiBaseReturnType<Track[]>;
}
