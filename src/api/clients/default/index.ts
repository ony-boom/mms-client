import { Track } from "@/api";
import type { Api } from "@/api/Api";
import { GET_TRACKS } from "./queries";
import { axiosClient } from "./axios-client";
import { useQuery } from "@tanstack/react-query";
import { GET_TRACK_COVER } from "@/api/clients/default/queries/get-track-cover.ts";

export const defaultApi: Api = {
  useTracks: (where, sortBy) => {
    return useQuery<Track[]>({
      queryKey: ["tracks", where, sortBy],
      queryFn: async () => {
        const { data: responseData } = await axiosClient.post<{
          data: { tracks: Track[] };
        }>("/", {
          query: GET_TRACKS,
          variables: { where, sortBy },
        });

        return responseData.data.tracks;
      },
    });
  },

  useTrackCover: (trackId) => {
    return useQuery<string>({
      queryKey: ["track-cover", trackId],
      queryFn: async () => {
        const { data: responseData } = await axiosClient.post<{
          data: { coverFromTrack: string };
        }>("/", {
          query: GET_TRACK_COVER,
          variables: { trackId },
        });

        return responseData.data.coverFromTrack;
      },
    });
  },
};
