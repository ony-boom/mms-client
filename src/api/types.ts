export type Track = {
  id: string;
  title: string;
  path: string;
  artists: Artist[];
  dateAdded?: string;
  isFavorite?: boolean;
};

export type Artist = {
  id: string;
  name: string;
};

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum TrackSortField {
  TITLE = "title",
  DATE_ADDED = "dateAdded",
  ALBUM_TITLE = "albumTitle",
}
