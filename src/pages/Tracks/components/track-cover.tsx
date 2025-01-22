import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useApiClient } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export function TrackCover({
  trackId,
  trackTitle,
}: {
  trackId: string;
  trackTitle: string;
}) {
  const api = useApiClient();

  const { data, isLoading } = api.useTrackCover(trackId);

  return (
    <div className="w-48">
      <AspectRatio ratio={4 / 4}>
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <img
            loading="lazy"
            src={`data:image/jpeg;base64,${data}`}
            className="object-cover"
            alt={trackTitle}
          />
        )}
      </AspectRatio>
    </div>
  );
}
