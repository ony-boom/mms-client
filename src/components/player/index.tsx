import { useApiClient } from "@/hooks";
import { usePlayerStore } from "@/stores";
import { type ElementRef, useEffect, useRef, useState } from "react";
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
import { motion, AnimatePresence } from "motion/react";
import { Playlists } from "@/components/player/playlists.tsx";
import { cn } from "@/lib/utils.ts";

export function Player() {
  const [expanded, setExpanded] = useState(false);
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
      <motion.div
        className={
          "with-blur fixed bottom-4 left-[50%] z-50 min-h-[81px] w-max translate-x-[-50%] overflow-hidden rounded-xl transition-all"
        }
      >
        <div className="relative flex items-center justify-between gap-16 p-4">
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
              disabled={!hasPrev() || !currentTrackId}
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
              disabled={!hasNext() || !currentTrackId}
              size="icon"
              variant="ghost"
            >
              <SkipForward />
            </Button>
          </div>
          <div className="absolute top-1 left-[50%] translate-x-[-50%]">
            <button
              className={cn(
                "bg-foreground/20 hover:bg-foreground/30 h-1 w-12 cursor-pointer rounded-full outline-0 transition-all hover:w-16",
                {
                  "w-20": expanded,
                },
              )}
              onClick={() => setExpanded((prev) => !prev)}
            ></button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              key="playlists"
              initial={{
                height: 0,
              }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              <Playlists />
            </motion.div>
          )}
        </AnimatePresence>
        <TrackProgress audioRef={audioRef} currentTrack={currentTrack} />
      </motion.div>
    </>
  );
}
