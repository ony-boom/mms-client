import { useState } from "react";

const DEFAULT_PLAYER_STATE: PlayerState = {
  playlist: {},
  audioState: {
    src: "",
    duration: 0,
    currentTime: 0,
    isPlaying: false,
  },
};

export const usePlayerState = () => {
  const [playerState, setPlayerState] =
    useState<PlayerState>(DEFAULT_PLAYER_STATE);

  const resetPlayerState = () => {
    setPlayerState(DEFAULT_PLAYER_STATE);
  };

  return { playerState, setPlayerState, resetPlayerState };
};

export type PlayerState = {
  playlist: object;
  audioState: {
    src: string;
    duration: number;
    isPlaying: boolean;
    currentTime: number;
  };
};
