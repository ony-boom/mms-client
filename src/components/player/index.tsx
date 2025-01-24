import { cn } from "@/lib/utils.ts";
import { useApiClient } from "@/hooks";
import { usePlayerState } from "@/stores";
import {
  HTMLProps,
  useRef,
  type ElementRef,
  useEffect,
  ReactEventHandler,
} from "react";
import { TrackCover } from "@/pages/Tracks/components/track-cover";

export function Player({ className, ...rest }: PlayerProps) {
  const { useTracks } = useApiClient();
  const { isPlaying, src, currentTrackId, setPosition, pause, play } =
    usePlayerState();
  const audioRef = useRef<ElementRef<"audio">>(null);

  const { data } = useTracks({
    id: currentTrackId,
  });

  const currentTrack = data?.at(0);

  const onTimeUpdate: ReactEventHandler<HTMLAudioElement> = (event) => {
    setPosition((event.target as HTMLAudioElement).currentTime);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const audioElement = audioRef.current;
    if (isPlaying) {
      audioElement.play().then();
    } else {
      audioElement.pause();
    }
  }, [isPlaying, src]);

  return (
    <>
      <audio
        src={src}
        onPlay={play}
        ref={audioRef}
        onPause={pause}
        onTimeUpdate={onTimeUpdate}
      />
      <div className={cn("bg-background py-4", className)} {...rest}>
        <div className="flex">
          <div aria-labelledby="track info" className="flex items-end gap-4">
            {currentTrack ? (
              <>
                <TrackCover
                  className="w-[72px]"
                  trackId={currentTrack.id!}
                  trackTitle={currentTrack.title}
                />

                <div className="animate-fade-in">
                  <p
                    title={currentTrack.title}
                    className="overflow-hidden font-bold text-nowrap text-ellipsis"
                  >
                    {currentTrack.title}
                  </p>
                  <small>
                    {currentTrack.artists
                      .map((artist) => artist.name)
                      .join(", ")}
                  </small>
                </div>
              </>
            ) : (
              <div className="bg-muted aspect-square w-[72px]"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export type PlayerProps = HTMLProps<HTMLDivElement>;
