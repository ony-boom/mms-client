import { Howl } from "howler";
import { usePlayListStore } from "@/stores";
import { useMemo } from "react";
import { useApiClient } from "@/hooks/useApiClient.ts";

export const usePlayListPlayer = () => {
  const { playlist } = usePlayListStore();
  const { useTrackSrc } = useApiClient();
  const src = useTrackSrc(playlist);

  return useMemo(() => {
    return new Howl({ src });
  }, [src]);
};
