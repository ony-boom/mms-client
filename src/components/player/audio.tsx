import { Track } from "@/api";
import { usePlayerStore } from "@/stores";
import { useApiClient } from "@/hooks";
import {
  ReactEventHandler,
  useCallback,
  forwardRef,
  useEffect,
  memo,
} from "react";

export const Audio = memo(
  forwardRef<HTMLAudioElement, AudioProps>(({ currentTrack }, ref) => {
    const { getTrackCoverSrc } = useApiClient();
    const {
      src,
      currentTrackId,
      setDuration,
      setPosition,
      position,
      pause,
      play,
      playNext,
      playPrev,
      volume,
    } = usePlayerStore.getState();

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
      audioElement.volume = volume;
      audioElement.currentTime = position;
      updateNavigatorMetadata();
    };

    useEffect(() => {
      navigator.mediaSession.setActionHandler("previoustrack", playPrev);
      navigator.mediaSession.setActionHandler("nexttrack", playNext);
    }, [playNext, playPrev]);

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
  }),
);

export type AudioProps = {
  currentTrack?: Track;
};
