import { Audio } from "./audio";
import { cn } from "@/lib/utils";
import { useApiClient } from "@/hooks";
import { usePlayerStore } from "@/stores";
import { Controller } from "./controller";
import { TrackProgress } from "./track-progress";
import { Button } from "@/components/ui/button.tsx";
import { Maximize2 as Maximize, Minimize2 as Minimize } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Playlists } from "@/components/player/playlists";
import { TrackCover } from "@/pages/Tracks/components/track-cover";
import { type ElementRef, useEffect, useRef, useState } from "react";
import { Lyrics } from "./lyrics";

export function Player() {
  const [playlistsExpanded, setPlaylistsExpanded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openFullScreen, setOpenFullScreen] = useState(false);

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
        id="player"
        layout
        variants={playerVariants}
        initial="initial"
        animate="animate"
        custom={openFullScreen}
        className="with-blur fixed left-[50%] z-50 flex max-h-screen translate-x-[-50%] flex-col rounded overflow-hidden will-change-transform"
      >
        <AnimatePresence>
          {openFullScreen && (
            <motion.div>
              <Lyrics />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className={cn("with-blur sticky bottom-0", {
            "overflow-hidden": !openFullScreen,
          })}
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
            <motion.div
              layout
              aria-labelledby="track info"
              className="flex items-end gap-4"
            >
              {currentTrack ? (
                <>
                  <div className="group relative">
                    <TrackCover
                      className={"w-20"}
                      trackId={currentTrack.id!}
                      trackTitle={currentTrack.title}
                    />

                    <Button
                      size={"icon"}
                      onClick={() => handleFullScreenToggle()}
                      className="absolute right-0 bottom-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      {openFullScreen ? <Minimize /> : <Maximize />}
                    </Button>
                  </div>

                  <div className="animate-fade-in max-w-[148px]">
                    <p
                      title={currentTrack.title}
                      className="overflow-hidden font-bold text-nowrap text-ellipsis"
                    >
                      {currentTrack.title}
                    </p>
                    <small className="overflow-hidden text-nowrap text-ellipsis">
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
            </motion.div>

            <Controller shouldPlay={!currentTrack} />
          </div>

          <TrackProgress audioRef={audioRef} currentTrack={currentTrack} />

          <AnimatePresence>
            {playlistsExpanded && (
              <motion.div
                key="playlists"
                variants={playlistVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <Playlists />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}

const playerVariants: Variants = {
  initial: {
    opacity: 0,
    bottom: 16,
  },
  animate: (openFullScreen: boolean) => ({
    opacity: 1,
    bottom: openFullScreen ? 0 : 16,
    height: openFullScreen ? "100vh" : "auto",
    width: openFullScreen ? "100%" : "max-content",
    transition: {
      duration: 0.3,
      opacity: {
        duration: 0.2,
      },
    },
  }),
};

const playlistVariants: Variants = {
  initial: {
    height: 0,
  },
  animate: {
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};
