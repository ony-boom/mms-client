import { Track } from "@/api";
import { TrackCard } from "@/pages/Tracks/components/track-card.tsx";
import { VirtuosoGrid, type GridComponents } from "react-virtuoso";
import { forwardRef } from "react";

const components: GridComponents = {
  List: forwardRef(({ style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        style={{
          gap: "32px",
          display: "flex",
          flexWrap: "wrap",
          ...style,
          paddingBottom: "32px",
        }}
      >
        {children}
      </div>
    );
  }),
  Item: ({ children, ...props }) => (
    <div {...props} className="w-64">
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
      totalCount={tracks.length}
      components={components}
      itemContent={(index) => (
        <TrackCard
          onTrackPlay={onTrackPlay}
          track={tracks[index]}
          index={index}
        />
      )}
      style={{ height: "calc(100vh - 114px)", willChange: "transform" }}
    />
  );
}

type TracksGridProps = {
  tracks: Track[];
  onTrackPlay: (index: number, id: string) => void;
};
