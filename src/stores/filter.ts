import { create } from "zustand/react";
import { GetTrackSortByInput, GetTrackWhereInput } from "@/api/Api.ts";

export const useFilterStore = create<{
  query?: GetTrackWhereInput;
  sort?: GetTrackSortByInput;
  setFilter: (filter: {
    query?: GetTrackWhereInput;
    sort?: GetTrackSortByInput;
  }) => void;
  setQuery: (query?: GetTrackWhereInput) => void;
  setSort: (sort?: GetTrackSortByInput) => void;
  openSearchComponent: boolean;
  setOpenSearchComponent: (open: boolean) => void;
}>((set) => ({
  openSearchComponent: false,
  setOpenSearchComponent: (open) => set({ openSearchComponent: open }),
  query: undefined,
  sort: undefined,
  setSort: (sort) => set({ sort }),
  setQuery: (query) => set({ query }),
  setFilter: (filter) => set(filter),
}));
