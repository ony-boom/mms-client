import { useApiClient } from "@/hooks";
import { Cover } from "@/components/cover";

export function TrackCover({
  trackId,
  trackTitle,
}: {
  trackId: string;
  trackTitle: string;
}) {
  const api = useApiClient();
  const src = api.getTrackCoverSrc(trackId);

  return (
    <div className="aspect-square w-full max-w-[456px] overflow-hidden rounded-lg">
      <Cover
        src={src}
        alt={trackTitle}
        className="h-full w-full"
      />
    </div>
  );
}
