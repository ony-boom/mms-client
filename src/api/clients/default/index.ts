import { Track } from "@/api";
import { GET_TRACKS } from "./queries";
import { apolloClient } from "./apollo";
import { useEffect, useState } from "react";
import type { Api, ApiBaseReturnType } from "@/api/Api";

export const defaultApi: Api = {
  useTracks: (where, sortBy) => {
    const [state, setState] = useState<ApiBaseReturnType<Track[]>>({
      data: null,
      errors: null,
      loading: true,
    });

    useEffect(() => {
      apolloClient
        .query<Track[]>({
          query: GET_TRACKS,
          variables: {
            where,
            sortBy,
          },
        })
        .then((result) => {
          setState((oldState) => {
            return {
              ...oldState,
              data: result.data ?? null,
              loading: result.loading,
              errors: result.errors ?? null,
            };
          });
        });
    }, []);

    return state;
  },
};
