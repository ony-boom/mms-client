import { Lrc } from "lrc-kit";
import { cn } from "@/lib/utils";
import { useApiClient } from "@/hooks";
import { usePlayerStore } from "@/stores";
import { useMemo, useRef, useEffect } from "react";
import { LyricsResponse } from "@/api";
import { motion } from "motion/react";

export function Lyrics() {
  const { currentTrackId, position, isPlaying } = usePlayerStore();
  const { useTrackLyrics } = useApiClient();
  const { data } = useTrackLyrics(currentTrackId!);

  const lyrics: LyricsResponse = useMemo(
    () => data || { isSync: false, text: "" },
    [data],
  );
  const lrc = useMemo(
    () => (lyrics.text && lyrics.isSync ? Lrc.parse(lyrics.text) : null),
    [lyrics],
  );

  const activeLyricRef = useRef<HTMLParagraphElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting && activeLyricRef.current && isPlaying) {
        activeLyricRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });

    if (activeLyricRef.current) {
      observerRef.current.observe(activeLyricRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [position]);

  if (!lyrics.text) {
    return (
      <div className="w-full space-y-4 overflow-auto p-12 text-3xl font-black">
        <p>Looks like we don't have the lyrics for this one</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: 0.3,
      }}
      className="w-full space-y-4 overflow-auto p-12 text-3xl font-black"
    >
      {lyrics.isSync ? (
        lrc!.lyrics.map((lyric, index) => {
          const nextTimestamp = lrc!.lyrics[index + 1]?.timestamp ?? Infinity;
          const isActive =
            position >= lyric.timestamp && position < nextTimestamp;

          return (
            <p
              ref={isActive ? activeLyricRef : null}
              className={cn("text-foreground/55 transition-colors", {
                "text-foreground": isActive,
              })}
              key={lyric.timestamp}
            >
              {lyric.content}
            </p>
          );
        })
      ) : (
        <div className="space-y-2 text-xl">
          {lyrics.text.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
