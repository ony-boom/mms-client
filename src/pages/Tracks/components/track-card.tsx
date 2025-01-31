import { Track } from "@/api";
import { usePlayerStore } from "@/stores";
import { TrackCover } from "./track-cover";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@/components/ui/context-menu";

export function TrackCard({ track, index, onTrackPlay }: TrackCardProps) {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");
  const player = usePlayerStore();

  const isCurrent = track.id === player.currentTrackId;

  const onPlayButtonClick = () => {
    onTrackPlay(index, track.id);
  };

  const onPlayNextClick = () => {
    player.playAfter(track.id);
  };

  return (
    <div className="group relative flex flex-col gap-1">
      <ContextMenu>
        <ContextMenuTrigger>
          <TrackCover
            className="mb-2 max-w-[256px]"
            trackId={track.id}
            trackTitle={track.title}
          />
          <p
            title={track.title}
            className="overflow-hidden font-bold text-nowrap text-ellipsis"
          >
            {track.title}
          </p>
          <p
            title={artistNames}
            className="overflow-hidden text-sm text-nowrap text-ellipsis"
          >
            {artistNames}
          </p>
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-background/80 w-max border p-0 shadow-xl backdrop-blur-xl transition-all backdrop:saturate-150">
          <ContextMenuItem
            className="data-[highlighted]:bg-accent/60"
            onClick={onPlayNextClick}
          >
            Play next
          </ContextMenuItem>

          <ContextMenuItem className="data-[highlighted]:bg-accent/60">
            Go to artist
          </ContextMenuItem>

          <ContextMenuItem className="data-[highlighted]:bg-accent/60">
            Go to album
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Button
        size="icon"
        onClick={onPlayButtonClick}
        className="absolute right-2 bottom-[68px] z-20 opacity-0 shadow-xl transition group-hover:opacity-100"
      >
        {isCurrent && player.isPlaying ? <Pause /> : <Play />}
      </Button>
    </div>
  );
}

type TrackCardProps = {
  track: Track;
  index: number;
  onTrackPlay: (index: number, id: string) => void;
};
