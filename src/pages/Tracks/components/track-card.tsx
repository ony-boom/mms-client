import { Track } from "@/api";
import { TrackCover } from "./track-cover";

export function TrackCard({ track }: TrackCardProps) {
  // const artistNames = track.artists.map((artist) => artist.name).join(", ");
  return (
    <div>
      <TrackCover trackId={track.id} trackTitle={track.title} />
      <p>{track.title}</p>
      {/*<p>{artistNames}</p>*/}
    </div>
  );
}

type TrackCardProps = {
  track: Track;
};
