import { Track } from "@/api";

// import {useApiClient} from "@/hooks";

export function TrackCard({ track }: TrackCardProps) {
  return (
    <div>
      <p>{track.title}</p>
    </div>
  );
}

type TrackCardProps = {
  track: Track;
};
