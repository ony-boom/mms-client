import { Track } from "@/api";
import type { Api } from "@/api/Api";
import { GET_TRACKS } from "./queries";
import { axiosClient, BASE_URL } from "./axios-client";
import { useQuery } from "@tanstack/react-query";

export const defaultApi: Api = {
  useTracks: (where, sortBy) => {
    return useQuery<Track[]>({
      queryKey: ["tracks", where, sortBy],
      queryFn: async () => {
        const { data: responseData } = await axiosClient.post<{
          data: { tracks: Track[] };
        }>("/graphql", {
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
        return `${BASE_URL}/api/cover/${trackId}`;
      },
    });
  },

  useTrackSrc: (trackIds) => {
    return trackIds.map((trackId) => `${BASE_URL}/api/track/${trackId}`);
  },
};
