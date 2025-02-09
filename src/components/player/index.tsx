import { Audio } from "./audio";
import { cn } from "@/lib/utils";
import { useApiClient } from "@/hooks";
import { usePlayerStore } from "@/stores";
import { Controller } from "./controller";
import { TrackProgress } from "./track-progress";
import { Button } from "@/components/ui/button.tsx";
import { Maximize2 as Maximize } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Playlists } from "@/components/player/playlists";
import { TrackCover } from "@/pages/Tracks/components/track-cover";
import { type ElementRef, useEffect, useRef, useState } from "react";

export function Player() {
  const [playlistsExpanded, setPlaylistsExpanded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setOpenFullScreen] = useState(false);

  const { useTracks } = useApiClient();
  const { isPlaying, src, currentTrackId } = usePlayerStore();
  const audioRef = useRef<ElementRef<"audio">>(null);

  const { data } = useTracks({
    id: currentTrackId,
  });

  const currentTrack = data?.length === 1 ? data[0] : undefined;

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

  const handleFullScreenToggle = (value?: boolean) => {
    setOpenFullScreen(value ?? ((prev) => !prev));
  };

  return (
    <>
      <Audio currentTrack={currentTrack} ref={audioRef} />
      <motion.div
        className={
          "with-blur fixed bottom-4 left-[50%] z-50 min-h-[81px] w-max translate-x-[-50%] overflow-hidden rounded transition-all will-change-transform"
        }
      >
        <div className="mt-2 flex justify-center">
          <button
            className={cn(
              "bg-foreground/20 hover:bg-foreground/30 h-1 w-12 cursor-pointer rounded-full outline-0 transition-all hover:w-16",
              {
                "w-20": playlistsExpanded,
              },
            )}
            onClick={() => setPlaylistsExpanded((prev) => !prev)}
          ></button>
        </div>
        <div className="relative flex items-center justify-between gap-16 px-2 pt-0 pb-4">
          <div aria-labelledby="track info" className="flex items-end gap-4">
            {currentTrack ? (
              <>
                <div className="group relative">
                  <TrackCover
                    className="w-20 rounded-md"
                    trackId={currentTrack.id!}
                    trackTitle={currentTrack.title}
                  />

                  <Button
                    size={"icon"}
                    onClick={() => handleFullScreenToggle(true)}
                    className="absolute right-0 bottom-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Maximize />
                  </Button>
                </div>

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
          <Controller shouldPlay={!currentTrack} />
        </div>

        <AnimatePresence>
          {playlistsExpanded && (
            <motion.div
              key="playlists"
              initial={{
                height: 0,
              }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              layout
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
