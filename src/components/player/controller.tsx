import {
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { usePlayerStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { FavouriteButton } from "@/components";

export function Controller({ shouldPlay }: ControllerProps) {
  const {
    isPlaying,
    currentTrackId,
    toggle,
    playNext,
    playPrev,
    toggleShuffle,
    isShuffle,
    hasNext,
    hasPrev,
    getCurrentPlaylist,
  } = usePlayerStore();

  const handleShuffle = () => {
    toggleShuffle();
  };

  return (
    <div aria-labelledby="controller" className="flex items-center gap-2">
      <FavouriteButton variant={"ghost"} />
      <Button
        onClick={handleShuffle}
        className={isShuffle ? "text-foreground" : "text-foreground/50"}
        size="icon"
        variant="ghost"
        disabled={getCurrentPlaylist().length === 0}
      >
        <Shuffle />
      </Button>
      <Button
        onClick={playPrev}
        disabled={!hasPrev() || !currentTrackId}
        size="icon"
        variant="ghost"
      >
        <SkipBack />
      </Button>
      <Button disabled={Boolean(shouldPlay)} onClick={toggle} size="icon">
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <Button
        onClick={playNext}
        disabled={!hasNext() || !currentTrackId}
        size="icon"
        variant="ghost"
      >
        <SkipForward />
      </Button>
    </div>
  );
}

export type ControllerProps = {
  shouldPlay?: boolean;
};
