import { Track } from "@/api";
import { usePlayerState } from "@/stores";
import { TrackCover } from "./track-cover";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TrackCard({ track, index }: TrackCardProps) {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");
  const player = usePlayerState();

  const isCurrent = track.id === player.currentTrackId;

  const onPlayButtonClick = async () => {
    if (!isCurrent) {
      player.toggleShuffle(false);
      player.playTrackAtIndex(index);
      return;
    }
    player.toggle();
  };

  return (
    <div className="group relative flex flex-col gap-1">
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
};
