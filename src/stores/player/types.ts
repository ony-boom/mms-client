export type Track = {
  id: string;
  src: string;
};

export interface PlayerStateProperties {
  src?: string;
  position: number;
  isPlaying: boolean;
  duration: number;
  playlists: Map<string, string>;
  playlistOrder: string[];
  playingIndex: number;
  currentTrackId?: string;
  isShuffle: boolean;
  shuffleOrder: string[];
}

export interface PlayerStateActions {
  setSrc: (src: string) => void;
  setPosition: (position: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setDuration: (duration: number) => void;
  setPlaylists: (playlists: Track[]) => void;
  getCurrentPlaylist: () => Track[];
  setPlayingIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  playNext: () => void;
  playPrev: () => void;
  playAfter: (id: string, src?: string) => void;
  hasPrev: () => boolean;
  hasNext: () => boolean;
  toggleShuffle: (value?: boolean, shuffleAll?: boolean) => void;
  playTrackAtIndex: (index: number) => void;
  playAtRandom: () => void;
  getCurrentIndex: () => number;
  getCurrentTrack: () => Track | undefined;
}

export type PlayerState = PlayerStateProperties & PlayerStateActions;
