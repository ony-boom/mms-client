import { useApiClient } from "@/hooks/use-api-client.ts";
import { useEffect, useState } from "react";
import { usePlayerStore } from "@/stores";
import mdc from "material-dynamic-colors";

type MaterialDynamicColors = Awaited<ReturnType<typeof mdc>>

export const useColorFlow = () => {
  const { currentTrackId } = usePlayerStore();
  const { getTrackCoverSrc } = useApiClient();
  const [color, setColor] = useState<MaterialDynamicColors| null>(null);

  useEffect(() => {
    if (!currentTrackId) return;
    const src = getTrackCoverSrc(currentTrackId);
    (async () => {
      const colors = await mdc(src);
      setColor(colors);
    })();
  }, [currentTrackId]);

  return color;
};
