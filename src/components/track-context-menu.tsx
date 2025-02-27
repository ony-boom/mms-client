import { Track } from "@/api";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { usePlayerStore } from "@/stores";
import { CircleUserRound, Disc, Redo2 } from "lucide-react";
import { useApiClient } from "@/hooks";
import { memo, ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";

export const TrackContextMenu = memo(
  ({ track, children }: TrackContextMenuProps) => {
    const { playAfter, currentTrackId } = usePlayerStore(
      useShallow((state) => ({
        currentTrackId: state.currentTrackId,
        playAfter: state.playAfter,
      })),
    );
    const { getTrackAudioSrc } = useApiClient();

    const onPlayNextClick = () => {
      const src = getTrackAudioSrc([track.id])[0];
      playAfter(track.id, src);
    };

    return (
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="with-blur w-36 space-y-1 border-none p-0 transition-all">
          <ContextMenuItem
            className="w-full"
            onClick={onPlayNextClick}
            disabled={!currentTrackId}
          >
            Play next
            <Redo2 size={16} className="ml-auto" />
          </ContextMenuItem>

          <ContextMenuItem className="w-full">
            Go to artist
            <CircleUserRound size={16} className="ml-auto" />
          </ContextMenuItem>

          <ContextMenuItem className="w-full">
            Go to album
            <Disc size={16} className="ml-auto" />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
);

export type TrackContextMenuProps = {
  track: Track;
  children: ReactNode;
};
