import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import { GetTrackSortByInput, GetTrackWhereInput } from "@/api/Api.ts";

interface FilterStore {
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
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      openSearchComponent: false,
      setOpenSearchComponent: (open) => set({ openSearchComponent: open }),
      query: undefined,
      sort: undefined,
      setSort: (sort) => set({ sort }),
      setQuery: (query) => set({ query }),
      setFilter: (filter) => set(filter),
    }),
    {
      name: "filter",
      partialize(state) {
        return {
          sort: state.sort,
        };
      },
    },
  ),
);
