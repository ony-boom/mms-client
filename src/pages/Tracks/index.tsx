import { Shuffle } from "lucide-react";
import { usePlayerStore } from "@/stores";
import { PageTitle } from "@/components";
import { Loading } from "./components/loading";
import { SortOrder, TrackSortField } from "@/api";
import { Input } from "@/components/ui/input.tsx";
import { useApiClient, useDebounce } from "@/hooks";
import { Button } from "@/components/ui/button.tsx";
import { TracksGrid } from "./components/tracks-grid";
import { TrackMenuSort } from "./components/track-menu-sort";
import {
  ChangeEventHandler,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

export function Tracks() {
  const { useTracks, getTrackAudioSrc } = useApiClient();
  const { setPlaylists, toggleShuffle, playTrackAtIndex, ...player } =
    usePlayerStore();
  const [trackSearch, setTrackSearch] = useState("");
  const [trackSort, setTrackSort] = useState<TrackSortField>();
  const debouncedSearch = useDebounce(trackSearch, 250);
  const isPlaylistInitialized = useRef(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wasFocused = useRef(false);

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

  useEffect(() => {
    const shouldRestoreFocus = wasFocused.current;
    if (shouldRestoreFocus) {
      searchInputRef.current?.focus();
    }
  }, [data]);

  const handleInputFocus = useCallback(() => {
    wasFocused.current = true;
  }, []);

  const handleInputBlur = useCallback(() => {
    wasFocused.current = false;
  }, []);

  const playlist = useMemo(
    () =>
      data?.map((track) => ({
        id: track.id,
        src: getTrackAudioSrc([track.id])[0],
      })),
    [data, getTrackAudioSrc],
  );

  const updatePlaylist = useCallback(() => {
    if (playlist) {
      setPlaylists(playlist);
    }
  }, [playlist, setPlaylists]);

  const onSortChange = useCallback((sort: TrackSortField) => {
    setTrackSort(sort);
  }, []);

  const onTrackSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setTrackSearch(event.target.value);
    },
    [],
  );

  useEffect(() => {
    if (data && !isPlaylistInitialized.current) {
      updatePlaylist();
      isPlaylistInitialized.current = data.length > 0;
    }
  }, [data, updatePlaylist]);

  const handleShuffle = useCallback(() => {
    updatePlaylist();
    toggleShuffle(true, true);
    playTrackAtIndex(0);
  }, [updatePlaylist, toggleShuffle, playTrackAtIndex]);

  const handleTrackPlay = useCallback(
    (index: number, id: string) => {
      updatePlaylist();
      const isCurrent = id === player.currentTrackId;
      if (!isCurrent) {
        toggleShuffle(false);
        playTrackAtIndex(index);
        return;
      }
      player.toggle();
    },
    [updatePlaylist, player, toggleShuffle, playTrackAtIndex],
  );

  if (isLoading) {
    return (
      <div className="px-4">
        <PageTitle title="Tracks" />
        <Loading />
      </div>
    );
  }

  return (
    <div className="pl-4">
      <PageTitle title="Tracks" />
      <div className="bg-background/80 border-border flex w-max items-center gap-2 rounded-full border px-2 py-1">
        <Input
          ref={searchInputRef}
          placeholder="Search..."
          className="w-max border-none shadow-none focus-visible:ring-0"
          value={trackSearch}
          onChange={onTrackSearchChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <TrackMenuSort value={trackSort} onValueChange={onSortChange} />
        <Button
          disabled={!data || data.length < 2}
          onClick={handleShuffle}
          size="sm"
          className="rounded-full"
        >
          Shuffle <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4">
        <TracksGrid onTrackPlay={handleTrackPlay} tracks={data ?? []} />
      </div>
    </div>
  );
}