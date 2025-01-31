import type { Api } from "@/api/Api";
import { createClient } from "graphql-sse";
import { useEffect, useState } from "react";
import { LoadedTracks, Track } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GET_TRACKS, LOAD_TRACK, TRACK_LOAD } from "./queries";
import { axiosClient, BASE_URL } from "./axios-client";
import { CACHE_KEY } from "@/api/constant.ts";

export const defaultApi: Api = {
  useTracks: (where, sortBy) => {
    return useQuery<Track[]>({
      queryKey: [CACHE_KEY.TRACKS, where, sortBy],
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

  useLoadTracks: () => {
    return useMutation({
      mutationFn: async () => {
        const { data: responseData } = await axiosClient.post<{
          data: { loadTracks: boolean };
        }>("/graphql", {
          query: LOAD_TRACK,
        });

        return responseData.data.loadTracks;
      },
    });
  },

  getTrackCoverSrc: (trackId) => {
    return `${BASE_URL}/api/cover/${trackId}`;
  },

  getTrackAudioSrc: (trackIds) => {
    return trackIds.map((trackId) => `${BASE_URL}/api/audio/${trackId}`);
  },

  useTrackLoadEvent: (_debounce) => {
    const [state, setState] = useState<LoadedTracks>({
      current: 0,
      total: 0,
    });

    useEffect(() => {
      const client = createClient({ url: `${BASE_URL}/graphql` });

      (async () => {
        const subscription = client.iterate({
          query: TRACK_LOAD,
        });

        try {
          for await (const result of subscription) {
            const { data } = result as { data: { loadedTrack: LoadedTracks } };
            if (data) {
              setState(data.loadedTrack);
            }
          }
          client.dispose();
        } catch {
          client.dispose();
        }
      })();

      return () => {
        client.dispose();
      };
    }, []);

    return state;
  },
};
