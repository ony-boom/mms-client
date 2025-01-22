import { Track } from "@/api";
import { TrackCard } from "@/pages/Tracks/components/track-card.tsx";

export function TracksGrid({ tracks }: TracksGridProps) {
  if (tracks.length === 0) {
    return (
      <div>
        <p>Looks like there's nothing here 🪹</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 grid-cols-5">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}

type TracksGridProps = {
  tracks: Track[];
};
