import { Track } from "@/api";
import type { Api } from "@/api/Api";
import { GET_TRACKS } from "./queries";
import { axiosClient } from "./axiosClient";
import { useQuery } from "@tanstack/react-query";

export const defaultApi: Api = {
  useTracks: (where, sortBy) => {
    return useQuery<Track[]>({
      queryKey: ["tracks", where, sortBy],
      queryFn: async () => {
        const { data: responseData } = await axiosClient.post<{
          data: Track[];
        }>("/", {
          query: GET_TRACKS,
          variables: { where, sortBy },
        });

        return responseData.data;
      },
    });
  },
};
