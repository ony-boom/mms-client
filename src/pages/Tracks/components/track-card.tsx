import { Track } from "@/api";
import { Play } from "lucide-react";
import { TrackCover } from "./track-cover";
import { Button } from "@/components/ui/button";

export function TrackCard({ track }: TrackCardProps) {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  return (
    <div className="group relative flex flex-col gap-1">
      <TrackCover trackId={track.id} trackTitle={track.title} />
      <p
        title={track.title}
        className="overflow-hidden text-ellipsis text-nowrap font-bold"
      >
        {track.title}
      </p>
      <p
        title={artistNames}
        className="overflow-hidden text-ellipsis text-nowrap text-sm"
      >
        {artistNames}
      </p>

      <Button
        size="icon"
        className="absolute bottom-16 right-4 z-20 opacity-0 shadow-xl transition group-hover:opacity-100"
      >
        <Play />
      </Button>
    </div>
  );
}

type TrackCardProps = {
  track: Track;
};
