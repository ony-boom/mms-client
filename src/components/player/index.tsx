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
import { useEffect, useRef, useState, ElementRef } from "react";
import { Lyrics } from "./lyrics";
import { Track } from "@/api";

export function Player() {
  const [playlistsExpanded, setPlaylistsExpanded] = useState(false);
  const [openFullScreen, setOpenFullScreen] = useState(false);
  const { useTracks } = useApiClient();
  const { isPlaying, src, currentTrackId } = usePlayerStore();
  const audioRef = useRef<ElementRef<"audio">>(null);
  const { data } = useTracks({ id: currentTrackId });
  const currentTrack = data?.[0];

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying, src]);

  return (
    <>
      <Audio currentTrack={currentTrack} ref={audioRef} />
      <motion.div
        id="player"
        layout
        initial="initial"
        animate="animate"
        custom={openFullScreen}
        variants={playerVariants}
        className="with-blur fixed left-[50%] z-50 flex max-h-screen translate-x-[-50%] flex-col overflow-hidden rounded"
      >
        <AnimatePresence>
          {openFullScreen && (
            <motion.div
              key="lyrics"
              layout
              variants={lyricsVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              data-scroller
              className="overflow-y-auto"
            >
              <Lyrics />
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className={cn("mt-auto", {
            "mx-auto max-w-max":
              openFullScreen,
          })}
        >
          <motion.div className="mt-2 flex justify-center">
            <motion.button
              className="bg-foreground/20 hover:bg-foreground/30 h-1 cursor-pointer rounded-full"
              variants={handleVariants}
              animate={playlistsExpanded ? "expanded" : "collapsed"}
              onClick={() => setPlaylistsExpanded((prev) => !prev)}
            />
          </motion.div>
          <div className="relative flex items-center justify-between gap-16 px-2 pt-0 pb-4">
            <TrackInfo
              currentTrack={currentTrack!}
              openFullScreen={openFullScreen}
              onFullScreenToggle={() => setOpenFullScreen((prev) => !prev)}
            />
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
                layout="position"
              >
                <Playlists />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

const TrackInfo = ({
  currentTrack,
  openFullScreen,
  onFullScreenToggle,
}: {
  currentTrack: Track;
  openFullScreen: boolean;
  onFullScreenToggle: () => void;
}) => (
  <motion.div
    aria-labelledby="track info"
    className="flex items-end gap-4 shrink-0"
    variants={trackInfoVariants}
    initial="initial"
    animate="animate"
  >
    {currentTrack ? (
      <>
        <div className="group relative">
          <TrackCover
            className="w-20"
            trackId={currentTrack.id}
            trackTitle={currentTrack.title}
          />
          <Button
            size="icon"
            onClick={onFullScreenToggle}
            className="absolute right-0 bottom-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          >
            {openFullScreen ? <Minimize /> : <Maximize />}
          </Button>
        </div>
        <div className="max-w-[148px] text-nowrap">
          <p className="overflow-hidden font-bold text-ellipsis">
            {currentTrack.title}
          </p>
          <small className="overflow-hidden text-ellipsis">
            {currentTrack.artists.map((artist) => artist.name).join(", ")}
          </small>
        </div>
      </>
    ) : (
      <motion.div className="flex items-end gap-4" variants={skeletonVariants}>
        <div className="bg-muted aspect-square w-20 rounded-xl" />
        <div className="max-w-[148px]">
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </div>
      </motion.div>
    )}
  </motion.div>
);

const playerVariants: Variants = {
  initial: { opacity: 0, bottom: 16, width: 500 },
  animate: (openFullScreen: boolean) => ({
    opacity: 1,
    bottom: openFullScreen ? 0 : 16,
    width: openFullScreen ? "100%" : 500,
    overflow: "hidden",
    // transition: { type: "spring", stiffness: 100, damping: 20 },
  }),
};

const lyricsVariants = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: "100vh",
    opacity: 1,
  },
  exit: {
    height: 0,
    opacity: 0,
    // transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const playlistVariants = {
  initial: { height: 0 },
  animate: {
    height: "auto",
    // transition: { type: "spring", stiffness: 100, damping: 20 },
  },
  exit: {
    height: 0,
    // transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};
const handleVariants = { collapsed: { width: 48 }, expanded: { width: 80 } };
const trackInfoVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

const skeletonVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
