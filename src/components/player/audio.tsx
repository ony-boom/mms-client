import { Track } from "@/api";
import { usePlayerState } from "@/stores";
import { useApiClient } from "@/hooks";
import { ReactEventHandler, useCallback, forwardRef } from "react";

export const Audio = forwardRef<HTMLAudioElement, AudioProps>(
  ({ currentTrack }, ref) => {
    const { getTrackCoverSrc } = useApiClient();
    const {
      src,
      currentTrackId,
      setDuration,
      setPosition,
      pause,
      play,
      playNext,
    } = usePlayerState();

    const updateNavigatorMetadata = useCallback(() => {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack?.title,
        artist: currentTrack?.artists.map((artist) => artist.name).join(", "),
        artwork: [
          {
            src: getTrackCoverSrc(currentTrackId!),
            type: "image/jpeg",
          },
        ],
      });
    }, [
      currentTrack?.artists,
      currentTrack?.title,
      currentTrackId,
      getTrackCoverSrc,
    ]);

    const handleTimeUpdate: ReactEventHandler<HTMLAudioElement> = (event) => {
      const audioElement = event.target as HTMLAudioElement;
      setPosition(audioElement.currentTime);
    };

    const handleLoadedMetadata: ReactEventHandler<HTMLAudioElement> = (
      event,
    ) => {
      const audioElement = event.target as HTMLAudioElement;
      setDuration(audioElement.duration);
      updateNavigatorMetadata();
    };

    return (
      <audio
        src={src}
        onPlay={play}
        ref={ref}
        onPause={pause}
        onEnded={playNext}
        title={currentTrack?.title}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    );
  },
);

export type AudioProps = {
  currentTrack?: Track;
};
