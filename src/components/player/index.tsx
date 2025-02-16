import { Audio } from "./audio";
import { useApiClient, useAudioRef } from "@/hooks";
import { usePlayerStore } from "@/stores";
import { Controller } from "./controller";
import { TrackProgress } from "./track-progress";
import { Button } from "@/components/ui/button.tsx";
import { MessageSquareQuote } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Playlists } from "@/components/player/playlists";
import { TrackCover } from "@/pages/Tracks/components/track-cover";
import { useEffect, useState } from "react";
import { Lyrics } from "./lyrics";
import { Track } from "@/api";
import { cn } from "@/lib/utils";

export function Player() {
  const [playlistsExpanded, setPlaylistsExpanded] = useState(false);
  const [openLyricsView, setOpenLyricsView] = useState(false);
  const { useTracks } = useApiClient();
  const { isPlaying, src, currentTrackId } = usePlayerStore();
  const audioRef = useAudioRef();
  const { data } = useTracks({ id: currentTrackId });

  const currentTrack = data?.length === 1 ? data?.[0] : undefined;

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    (async () => {
      if (isPlaying && src) {
        await audioElement.play();
      } else {
        audioElement.pause();
      }
    })();
  }, [audioRef, isPlaying, src]);

  return (
    <>
      <AnimatePresence>
        {openLyricsView && (
          <motion.div
            key="lyrics"
            variants={lyricsVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            data-scroller
            className="with-blur fixed bottom-0 left-1/2 z-50 origin-bottom overflow-y-auto"
            style={{ transformOrigin: "bottom center" }}
          >
            <Lyrics onClose={() => setOpenLyricsView(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Audio currentTrack={currentTrack} ref={audioRef} />

      <div className="fixed bottom-4 left-[50%] z-50 translate-x-[-50%]">
        <div
          id="player"
          className="with-blur flex min-w-xl flex-col overflow-hidden rounded"
        >
          <div className="mt-2 flex justify-center">
            <button
              className={cn(
                "bg-foreground/20 hover:bg-foreground/30 w-16 cursor-pointer rounded py-1 transition-all hover:w-20",
                {
                  "w-24": playlistsExpanded,
                },
              )}
              onClick={() => setPlaylistsExpanded((prev) => !prev)}
            />
          </div>
          <div className="relative flex items-center justify-between gap-16 px-3 pt-1 pb-4">
            <TrackInfo
              currentTrack={currentTrack!}
              openLyricsView={openLyricsView}
              onFullScreenToggle={() => setOpenLyricsView((prev) => !prev)}
            />
            <Controller shouldPlay={!currentTrack} />
          </div>
          <TrackProgress currentTrack={currentTrack} />
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
      </div>
    </>
  );
}

const TrackInfo = ({
  currentTrack,
  openLyricsView,
  onFullScreenToggle,
}: {
  currentTrack: Track;
  openLyricsView: boolean;
  onFullScreenToggle: () => void;
}) => (
  <motion.div
    aria-labelledby="track info"
    className="flex shrink-0 items-end gap-4"
    variants={trackInfoVariants}
    initial="initial"
    animate="animate"
  >
    {currentTrack ? (
      <>
        <div className="group relative">
          <TrackCover
            className="w-24"
            trackId={currentTrack.id}
            trackTitle={currentTrack.title}
          />
          <Button
            size="icon"
            title={openLyricsView ? "Hide lyrics" : "Show lyrics"}
            onClick={onFullScreenToggle}
            className="absolute right-0 bottom-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            {<MessageSquareQuote />}
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
        <div className="bg-muted aspect-square w-24 rounded-xl" />
        <div className="max-w-[148px]">
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </div>
      </motion.div>
    )}
  </motion.div>
);

const lyricsVariants: Variants = {
  initial: {
    height: 0,
    width: 0,
    opacity: 0,
    x: "-50%",
    bottom: 0,
  },
  animate: {
    height: "100vh",
    width: "100vw",
    opacity: 1,
    x: "-50%",
    bottom: 0,
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    height: 0,
    width: 0,
    opacity: 0,
    x: "-50%",
    bottom: 0,
    transition: {
      type: "tween",
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const playlistVariants: Variants = {
  initial: { height: 0 },
  animate: {
    height: "auto",
  },
  exit: {
    height: 0,
  },
};

const trackInfoVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

const skeletonVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
