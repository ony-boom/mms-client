import { Shuffle } from "lucide-react";
import { PageTitle } from "@/components";
import { Loading } from "./components/loading";
import { SortOrder, TrackSortField } from "@/api";
import { Input } from "@/components/ui/input.tsx";
import { useApiClient, useDebounce } from "@/hooks";
import { Button } from "@/components/ui/button.tsx";
import { ChangeEventHandler, useEffect, useState } from "react";
import { TracksGrid } from "./components/tracks-grid";
import { TrackMenuSort } from "./components/track-menu-sort";
import { usePlayerState } from "@/stores";

export function Tracks() {
  const { useTracks, getTrackAudioSrc } = useApiClient();
  const { setPlaylists } = usePlayerState();
  const [trackSearch, setTrackSearch] = useState("");
  const [trackSort, setTrackSort] = useState<TrackSortField>();
  const debouncedSearch = useDebounce(trackSearch, 250);

  const { isLoading, data } = useTracks(
    {
      title: debouncedSearch,
    },
    trackSort
      ? {
          field: trackSort,
          order: SortOrder.ASC,
        }
      : undefined,
  );

  const onSortChange = (sort: TrackSortField) => {
    setTrackSort(sort);
  };

  const onTrackSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTrackSearch(event.target.value);
  };

  useEffect(() => {
    if (data) {
      setPlaylists(
        data.map((track) => ({
          id: track.id,
          src: getTrackAudioSrc([track.id])[0],
        })),
      );
    }
  }, [data, getTrackAudioSrc, setPlaylists]);

  return (
    <>
      <div className="px-4">
        <PageTitle title="Tracks" />
      </div>
      <div className="sticky top-2 z-30 pl-5">
        <div className="bg-background/80 border-border flex w-max items-center gap-2 rounded-full border px-2 py-1 backdrop-blur-2xl backdrop-saturate-150">
          <Input
            placeholder="Search..."
            className="w-max border-none shadow-none focus-visible:ring-0"
            value={trackSearch}
            onChange={onTrackSearchChange}
          />
          <TrackMenuSort value={trackSort} onValueChange={onSortChange} />

          <Button size="sm" className="rounded-full">
            Shuffle <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 px-4">
        {isLoading ? <Loading /> : <TracksGrid tracks={data ?? []} />}
      </div>
    </>
  );
}
