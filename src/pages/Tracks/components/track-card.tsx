import { Track } from "@/api";
import { Play } from "lucide-react";
import { TrackCover } from "./track-cover";
import { Button } from "@/components/ui/button";

export function TrackCard({ track }: TrackCardProps) {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  return (
    <div className="flex flex-col gap-1 relative group">
      <TrackCover trackId={track.id} trackTitle={track.title} />
      <p
        title={track.title}
        className="font-bold text-ellipsis overflow-hidden text-nowrap"
      >
        {track.title}
      </p>
      <p
        title={artistNames}
        className="text-sm text-ellipsis overflow-hidden text-nowrap"
      >
        {artistNames}
      </p>

      <Button
        size="icon"
        className="absolute z-20 right-4 bottom-16 shadow-xl opacity-0 group-hover:opacity-100 transition"
      >
        <Play />
      </Button>
    </div>
  );
}

type TrackCardProps = {
  track: Track;
};
