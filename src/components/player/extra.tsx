import { motion } from "motion/react";
import { useAudioRef } from "@/hooks";
import { Progress } from "../ui/progress";
import { useEffect, useState, WheelEventHandler } from "react";
import { Volume, Volume1, Volume2, VolumeOff } from "lucide-react";

export const Extra = () => {
  const audioRef = useAudioRef();
  const [volume, setVolume] = useState(audioRef.current?.volume || 0);

  const handleMouseWheel: WheelEventHandler<HTMLDivElement> = (e) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;

    audio.volume = Math.min(1, Math.max(0, +(audio.volume + delta).toFixed(2)));
  };

  const volumeValue = volume * 100;

  useEffect(() => {
    if (!audioRef.current) return;
    const handleVolumeChange = (e: Event) => {
      const audioEl = e.target as HTMLAudioElement;
      setVolume(audioEl.volume);
    };

    audioRef.current.addEventListener("volumechange", handleVolumeChange);

    return () => {
      audioRef.current?.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [audioRef]);

  return (
    <motion.div onWheel={handleMouseWheel} className="flex w-full justify-end">
      <div className="with-blur flex w-max items-center gap-1 rounded-md p-2">
        <VolumeComp volume={volumeValue} />
        <motion.div
          whileHover={{
            scaleY: 1.5,
          }}
        >
          <Progress value={volumeValue} className="w-20" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const VolumeComp = ({ volume }: { volume: number }) => {
  const SIZE = 18;

  if (volume === 0) {
    return <VolumeOff size={SIZE} />;
  }

  if (volume <= 50 && volume >= 20) {
    return <Volume1 size={SIZE} />;
  }

  if (volume > 50) {
    return <Volume2 size={SIZE} />;
  }

  return <Volume size={SIZE} />;
};
