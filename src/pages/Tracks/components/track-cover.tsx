import { useApiClient } from "@/hooks";
import { Cover } from "@/components/cover";
import { HTMLProps } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TrackCover({
  trackId,
  trackTitle,
  className,
  ...rest
}: TrackCoverProps) {
  const api = useApiClient();
  const src = api.getTrackCoverSrc(trackId);

  return (
    <div
      {...rest}
      className={cn(
        "aspect-square w-full max-w-[456px] overflow-hidden rounded",
        className,
      )}
    >
      <Cover
        src={src}
        alt={trackTitle}
        className="h-full w-full"
        placeholder={<Skeleton className="h-full w-full" />}
      />
    </div>
  );
}

export type TrackCoverProps = HTMLProps<HTMLDivElement> & {
  trackId: string;
  trackTitle: string;
};
