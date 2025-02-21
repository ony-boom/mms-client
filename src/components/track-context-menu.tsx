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
import { ReactNode } from "react";

export function TrackContextMenu({ track, children }: TrackContextMenuProps) {
  const player = usePlayerStore();
  const { getTrackAudioSrc } = useApiClient();

  const onPlayNextClick = () => {
    const src = getTrackAudioSrc([track.id])[0];
    player.playAfter(track.id, src);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="with-blur border-none w-36 space-y-1 p-0 transition-all">
        <ContextMenuItem
          className="w-full"
          onClick={onPlayNextClick}
          disabled={!player.currentTrackId}
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
}

export type TrackContextMenuProps = {
  track: Track;
  children: ReactNode;
};
