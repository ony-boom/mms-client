import { useApiClient } from "@/hooks";
import { Fade } from "transitions-kit";
import { AsyncImage } from "loadable-image";

export function TrackCover({
  trackId,
  trackTitle,
}: {
  trackId: string;
  trackTitle: string;
}) {
  const api = useApiClient();
  const { data } = api.useTrackCover(trackId);

  return (
    <div className="w-full max-w-[456px] aspect-square rounded-lg overflow-hidden">
      <AsyncImage
        src={data!}
        alt={trackTitle}
        Transition={Fade}
        className="h-full w-full"
      />
    </div>
  );
}
