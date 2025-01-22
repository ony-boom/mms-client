import { PageTitle } from "@/components";
import { Loading } from "./components/loading";
import { SortOrder, TrackSortField } from "@/api";
import { Input } from "@/components/ui/input.tsx";
import { useApiClient, useDebounce } from "@/hooks";
import { TracksGrid } from "./components/tracks-grid";
import { TrackMenuSort } from "./components/track-menu-sort";
import { ChangeEventHandler, useEffect, useState } from "react";

export function Tracks() {
  const [trackSort, setTrackSort] = useState<TrackSortField>();
  const [trackSearch, setTrackSearch] = useState("");
  const debouncedSearch = useDebounce(trackSearch);
  const api = useApiClient();

  const { isLoading, data } = api.useTracks(
    {
      title: debouncedSearch,
    },
    trackSort && {
      field: trackSort,
      order: SortOrder.ASC,
    },
  );

  const onSortChange = (sort: TrackSortField) => {
    setTrackSort(sort);
  };

  const onTrackSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTrackSearch(event.target.value);
  };

  useEffect(() => {}, [trackSearch]);

  return (
    <>
      <PageTitle
        title="Tracks"
        menu={
          <div className="flex items-center gap-4">
            <Input
              onChange={onTrackSearchChange}
              value={trackSearch}
              placeholder="Search..."
            />
            <TrackMenuSort
              value={trackSort ?? ""}
              onValueChange={onSortChange}
            />
          </div>
        }
      />
      <div className="mt-2">
        {isLoading ? <Loading /> : <TracksGrid tracks={data ?? []} />}
      </div>
    </>
  );
}
