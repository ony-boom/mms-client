import { memo } from "react";
import { Track } from "@/api";
import { usePlayerStore } from "@/stores";
import { MouseEventHandler } from "react";
import { Progress } from "@/components/ui/progress.tsx";
import { useAudioRef } from "@/hooks/use-audio-ref";

export const TrackProgress = memo(
  ({ currentTrack }: TrackProgressProps) => {
    const { position, duration } = usePlayerStore();
    const progress = (position * 100) / duration;
    const audioRef = useAudioRef();

    const onProgressClick: MouseEventHandler<HTMLDivElement> = (event) => {
      if (!audioRef.current || !currentTrack) return;

      const progressBar = event.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    };

    return (
      <Progress
        value={progress}
        onClick={onProgressClick}
        className="rounded-none absolute bottom-0 left-0 z-50 h-1 w-full bg-transparent transition-all hover:h-[6px] hover:cursor-pointer"
      />
    );
  },
);

export type TrackProgressProps = {
  currentTrack: Track | undefined;
};
