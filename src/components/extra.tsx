import { Sort } from "./sort.tsx";
import { useCallback, useMemo } from "react";
import { Search, Shuffle } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { SortOrder, TrackSortField } from "@/api";
import { useApiClient, useTrackList } from "@/hooks";
import { TrackLoadToast } from "./track-load-toast";
import { ModeToggle } from "@/components/mode-toggle";
import { useFilterStore, usePlayerStore } from "@/stores";

export function Extra() {
  const { resetPlaylist, trackList } = useTrackList();
  const { setSort, sort, query } = useFilterStore();
  const { setOpenSearchComponent } = useFilterStore();

  const { toggleShuffle, playTrackAtIndex } = usePlayerStore.getState();

  const { useTracks } = useApiClient();
  const { data } = useTracks();

  const onTrackSortChange = (value: TrackSortField, direction: SortOrder) => {
    setSort({ field: value, order: direction });
  };

  const handleShuffle = useCallback(() => {
    resetPlaylist();
    toggleShuffle(true, true);
    playTrackAtIndex(0);
  }, [resetPlaylist, toggleShuffle, playTrackAtIndex]);

  const handleSearchClick = () => {
    setOpenSearchComponent(true);
  };

  const hasSearch = useMemo(() => {
    if (!query) return false;
    return Object.values(query).some((value) => value);
  }, [query]);

  return (
    <div className="relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-md px-4 py-2">
      <div className="flex gap-2">
        <Sort
          onValueChange={onTrackSortChange}
          value={sort ?? { order: SortOrder.ASC, field: TrackSortField.NONE }}
        />
      </div>

      <div className="flex gap-2">
        {trackList?.length > 0 && (
          <Button variant={"ghost"} onClick={handleShuffle}>
            <span className="-mt-[2px]">{trackList?.length} Songs</span>
            <Shuffle />
          </Button>
        )}

        <Button
          size={"icon"}
          variant={"ghost"}
          className="relative"
          onClick={handleSearchClick}
          disabled={!data || !data.length}
        >
          <Search />

          {hasSearch && (
            <span className="bg-primary absolute top-2 right-2 h-1 w-1 rounded-full"></span>
          )}
        </Button>

        <TrackLoadToast variant={"ghost"} />

        <ModeToggle />
      </div>
    </div>
  );
}
