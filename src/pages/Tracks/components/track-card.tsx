import { memo } from "react";
import { Track } from "@/api";
import { usePlayerStore } from "@/stores";
import { TrackCover } from "./track-cover";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackContextMenu } from "@/components";

function Card({ track, index, onTrackPlay }: TrackCardProps) {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");
  const player = usePlayerStore();

  const isCurrent = track.id === player.currentTrackId;

  const onPlayButtonClick = () => {
    onTrackPlay(index, track.id);
  };

  return (
    <div className="group relative flex flex-col gap-1">
      <TrackContextMenu track={track}>
        <TrackCover
          className="mb-2"
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
      </TrackContextMenu>
      <Button
        size="icon"
        onClick={onPlayButtonClick}
        className="absolute right-2 bottom-16 z-20 opacity-0 shadow-xl transition group-hover:opacity-100"
      >
        {isCurrent && player.isPlaying ? <Pause /> : <Play />}
      </Button>
    </div>
  );
}

export const TrackCard = memo(Card);

type TrackCardProps = {
  track: Track;
  index: number;
  onTrackPlay: (index: number, id: string) => void;
};
