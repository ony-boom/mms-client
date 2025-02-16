import { Track } from "@/api";
import { forwardRef } from "react";
import { TrackCard } from "./track-card";
import { VirtuosoGrid, type GridComponents } from "react-virtuoso";

const ITEM_SIZE = 256;

const components: GridComponents = {
  List: forwardRef(({ style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        style={{
          ...style,
          display: "grid",
          gap: "32px",
          paddingInline: "16px",
          gridTemplateColumns: `repeat(auto-fill, minmax(${ITEM_SIZE}px, 1fr))`,
        }}
      >
        {children}
      </div>
    );
  }),
  Item: ({ children, ...props }) => (
    <div {...props} className="w-full">
      {children}
    </div>
  ),
};

export function TracksGrid({ tracks, onTrackPlay }: TracksGridProps) {
  if (tracks.length === 0) {
    return (
      <div className="py-4">
        <p>Looks like there's nothing here 🪹</p>
      </div>
    );
  }

  return (
    <VirtuosoGrid
      data={tracks}
      overscan={2}
      components={components}
      itemContent={(index, track) => (
        <TrackCard onTrackPlay={onTrackPlay} track={track} index={index} />
      )}
      style={{ height: "100vh", willChange: "transform" }}
    />
  );
}

type TracksGridProps = {
  tracks: Track[];
  onTrackPlay: (index: number, id: string) => void;
};
