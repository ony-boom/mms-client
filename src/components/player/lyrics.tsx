import { Lrc } from "lrc-kit";
import { useApiClient } from "@/hooks";
import { usePlayerStore } from "@/stores";
import { useMemo } from "react";
import { LyricsResponse } from "@/api";
import { cn } from "@/lib/utils";

export function Lyrics() {
  const { currentTrackId } = usePlayerStore();
  const { useTrackLyrics } = useApiClient();
  const { data } = useTrackLyrics(currentTrackId!);

  const { position } = usePlayerStore();

  const lyrics: LyricsResponse = useMemo(() => {
    if (!data) return { isSync: false, text: "" };
    return data;
  }, [data]);

  const lrc = useMemo(() => {
    if (!lyrics.text || !lyrics.isSync) return null;
    return Lrc.parse(lyrics.text);
  }, [lyrics]);

  return (
    <div data-scroller className="w-full h-[calc(100vh-108px)] overflow-auto space-y-4 p-6 text-3xl font-black">
      {lyrics.text ? (
        lyrics.isSync ? (
          lrc!.lyrics.map((lyric, index) => {
            const nextTimestamp = lrc!.lyrics[index + 1]?.timestamp ?? Infinity;
            const isActive =
              position >= lyric.timestamp && position < nextTimestamp;

            return (
              <p
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
          <div className="text-xl space-y-2">
            {lyrics.text.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )
      ) : (
        <p>Looks like we don't have the lyrics for this one</p>
      )}
    </div>
  );
}
