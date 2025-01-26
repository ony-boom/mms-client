import { Track } from "@/api";
import { TrackCard } from "@/pages/Tracks/components/track-card.tsx";

export function TracksGrid({ tracks }: TracksGridProps) {
  if (tracks.length === 0) {
    return (
      <div className="py-4">
        <p>Looks like there's nothing here 🪹</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 items-baseline gap-8 overflow-x-clip md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {tracks.map((track, index) => (
        <TrackCard key={track.id} track={track} index={index} />
      ))}
    </div>
  );
}

type TracksGridProps = {
  tracks: Track[];
};
