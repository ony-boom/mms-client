import { cn } from "@/lib/utils.ts";
import { useApiClient } from "@/hooks";
import { usePlayerStore } from "@/stores";
import { type ElementRef, HTMLProps, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Heart,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Audio } from "./audio";
import { TrackProgress } from "./track-progress";
import { TrackCover } from "@/pages/Tracks/components/track-cover";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export function Player({ className, ...rest }: PlayerProps) {
  const { useTracks } = useApiClient();
  const {
    isPlaying,
    src,
    currentTrackId,
    toggle,
    playNext,
    playPrev,
    toggleShuffle,
    isShuffle,
    hasNext,
    hasPrev,
    getCurrentPlaylist,
  } = usePlayerStore();
  const audioRef = useRef<ElementRef<"audio">>(null);

  const { data } = useTracks({
    id: currentTrackId,
  });

  const currentTrack = data?.length === 1 ? data[0] : undefined;

  const handleShuffle = () => {
    toggleShuffle();
  };

  useEffect(() => {
    if (!audioRef.current) return;
    const audioElement = audioRef.current;

    if (isPlaying) {
      audioElement.play().then(() => {
        navigator.mediaSession.playbackState = "playing";
      });
    } else {
      audioElement.pause();
      navigator.mediaSession.playbackState = "paused";
    }
  }, [isPlaying, src]);

  return (
    <>
      <Audio currentTrack={currentTrack} ref={audioRef} />
      <div
        className={cn(
          className,
          "bg-background/80 fixed bottom-4 left-[50%] z-50 min-h-[81px] w-max translate-x-[-50%] overflow-hidden rounded-xl border shadow-xl backdrop-blur-xl transition-all backdrop:saturate-150",
        )}
        {...rest}
      >
        <div className="relative flex items-center justify-between gap-16 p-2 pb-3">
          <div aria-labelledby="track info" className="flex items-end gap-4">
            {currentTrack ? (
              <>
                <TrackCover
                  className="w-[72px] rounded-xl"
                  trackId={currentTrack.id!}
                  trackTitle={currentTrack.title}
                />

                <div className="animate-fade-in">
                  <p
                    title={currentTrack.title}
                    className="w-[128px] overflow-hidden font-bold text-nowrap text-ellipsis"
                  >
                    {currentTrack.title}
                  </p>
                  <small className="w-[128px] overflow-hidden text-nowrap text-ellipsis">
                    {currentTrack.artists
                      .map((artist) => artist.name)
                      .join(", ")}
                  </small>
                </div>
              </>
            ) : (
              <div className="flex items-end gap-4">
                <div className="bg-muted aspect-square w-[72px] rounded-xl"></div>
                <div>
                  <Skeleton className="w-[128px]" />
                  <Skeleton className="w-[128px]" />
                </div>
              </div>
            )}
          </div>
          <div aria-labelledby="controller" className="flex items-center gap-2">
            <Button disabled size="icon" variant="ghost">
              <Heart />
            </Button>
            <Button
              onClick={handleShuffle}
              className={isShuffle ? "text-foreground" : "text-foreground/50"}
              size="icon"
              variant="ghost"
              disabled={getCurrentPlaylist().length === 0}
            >
              <Shuffle />
            </Button>
            <Button
              onClick={playPrev}
              disabled={!hasPrev()}
              size="icon"
              variant="ghost"
            >
              <SkipBack />
            </Button>
            <Button
              disabled={!currentTrack}
              onClick={toggle}
              size="icon"
              className="rounded-full"
            >
              {isPlaying ? <Pause /> : <Play />}
            </Button>
            <Button
              onClick={playNext}
              disabled={!hasNext()}
              size="icon"
              variant="ghost"
            >
              <SkipForward />
            </Button>
          </div>
          <TrackProgress audioRef={audioRef} currentTrack={currentTrack} />
        </div>
      </div>
    </>
  );
}

export type PlayerProps = HTMLProps<HTMLDivElement>;
