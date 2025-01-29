import { useApiClient } from "@/hooks";

export const TrackLoadToast = () => {
  const { useTrackLoadEvent } = useApiClient();

  useTrackLoadEvent();
  return <></>;
};
