import { useEffect } from "react";
import { motion, useAnimation } from "motion/react"; // Keeping the import as is
import { usePlayerStore } from "@/stores";

export function WaveBars() {
  const { isPlaying } = usePlayerStore();
  const controls = useAnimation();

  useEffect(() => {
    if (isPlaying) {
      controls.start((i) => ({
        height: ["10%", "80%", "40%", "60%", "20%", "90%"],
        transition: {
          duration: 1.6,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: i * 0.2, // Add a delay to create an alternating effect
        },
      }));
    } else {
      controls.stop();
    }
  }, [isPlaying, controls]);

  return (
    <div className="h-6 flex gap-1 items-end">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="bg-primary w-[2px]"
          animate={controls}
          custom={index} // Pass the index to customize the animation for each bar
        />
      ))}
    </div>
  );
}
