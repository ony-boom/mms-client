import { Track } from "@/api";
import { TrackCover } from "./track-cover";

export function TrackCard({ track }: TrackCardProps) {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  return (
    <div className="flex flex-col gap-1 relative">
      <TrackCover trackId={track.id} trackTitle={track.title} />
      <p className="font-bold">{track.title}</p>
      <p
        title={artistNames}
        className="text-sm text-ellipsis overflow-hidden text-nowrap"
      >
        {artistNames}
      </p>
    </div>
  );
}

type TrackCardProps = {
  track: Track;
};
