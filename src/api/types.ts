export type Track = {
  id: string;
  name: string;
  path: string;
  dateAdded?: string;
  isFavorite?: boolean;
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
