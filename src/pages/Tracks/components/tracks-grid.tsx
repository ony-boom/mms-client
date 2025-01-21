import { Track } from "@/api";

export function TracksGrid({ tracks }: TracksGridProps) {
  if (tracks.length === 0) {
    return (
      <div>
        <p>Looks like there's nothing here 🪹</p>
      </div>
    );
  }
  return <div>You have {tracks.length} tracks</div>;
}

type TracksGridProps = {
  tracks: Track[];
};
