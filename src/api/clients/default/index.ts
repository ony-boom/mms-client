import type { Api } from "@/api/Api";
import { createClient } from "graphql-sse";
import { useEffect, useState } from "react";
import { LoadedTracks, Track } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { GET_TRACKS, TRACK_LOAD } from "./queries";
import { axiosClient, BASE_URL } from "./axios-client";

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

  getTrackCoverSrc: (trackId) => {
    return `${BASE_URL}/api/cover/${trackId}`;
  },

  getTrackAudioSrc: (trackIds) => {
    return trackIds.map((trackId) => `${BASE_URL}/api/audio/${trackId}`);
  },

  useTrackLoadEvent: (debounce) => {
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
        let timeout: NodeJS.Timeout;

        try {
          for await (const result of subscription) {
            const { data } = result;
            if (data) {
              timeout = setTimeout(() => {
                setState(data as LoadedTracks);
              }, debounce || 300);
            }
          }
          // @ts-expect-error
          clearTimeout(timeout);
          client.dispose();
        } catch {
          // @ts-expect-error
          clearTimeout(timeout);
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
