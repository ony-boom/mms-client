import { Sort } from "./sort.tsx";
import { useCallback } from "react";
import { Search, Shuffle } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { SortOrder, TrackSortField } from "@/api";
import { useApiClient, usePlaylist } from "@/hooks";
import { TrackLoadToast } from "./track-load-toast";
import { ModeToggle } from "@/components/mode-toggle";
import { useFilterStore, usePlayerStore } from "@/stores";

export function Extra() {
  const { resetPlaylist } = usePlaylist();
  const { setSort, sort } = useFilterStore();
  const { setOpenSearchComponent } = useFilterStore();
  const { toggleShuffle, playTrackAtIndex } = usePlayerStore();
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

  return (
    <div className="relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-md px-4 py-2">
      <div className="flex gap-2">
        <Sort
          onValueChange={onTrackSortChange}
          value={sort ?? { order: SortOrder.ASC, field: TrackSortField.NONE }}
        />
      </div>

      <div className="flex gap-2">
        {data && data.length && (
          <Button variant={"ghost"} onClick={handleShuffle}>
            <span className="-mt-[2px]">{data.length} Songs</span>
            <Shuffle />
          </Button>
        )}

        <Button
          disabled={!data || !data.length}
          onClick={handleSearchClick}
          variant={"ghost"}
          size={"icon"}
        >
          <Search />
        </Button>

        <TrackLoadToast variant={"ghost"} />

        <ModeToggle />
      </div>
    </div>
  );
}
