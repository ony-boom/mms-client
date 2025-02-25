import { Api } from "@/api/Api.ts";
import { LoadedTracks, TrackSortField } from "@/api";
import { CACHE_KEY } from "@/api/constant.ts";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

export const BASE_URL =
  import.meta.env.VITE_DEFAULT_REST_API_URL ?? "http://localhost:3000";

const mapTrackSortField = (field: TrackSortField) => {
  const obj: Record<TrackSortField, string> = {
    [TrackSortField.TITLE]: "title",
    [TrackSortField.DATE_ADDED]: "dateAdded",
    [TrackSortField.ALBUM_TITLE]: "album",
    [TrackSortField.NONE]: "",
  };

  return obj[field];
};

export const defaultRestApi: Api = {
  getTrackCoverSrc: (trackId: string) => {
    return `${BASE_URL}/api/cover/${trackId}`;
  },
  getTrackAudioSrc: (trackIds: string[]) => {
    return trackIds.map((trackId) => `${BASE_URL}/api/tracks/audio/${trackId}`);
  },

  useLoadTracks: () => {
    return useMutation({
      mutationFn: async () => {
        const response = await fetch(`${BASE_URL}/api/tracks/load`, {
          method: "POST",
        });

        const { data } = await response.json();
        return data;
      },
    });
  },

  useTracks: (where, sortBy) => {
    return useQuery({
      queryKey: [CACHE_KEY.TRACKS, where, sortBy],
      queryFn: async () => {
        const newUrl = new URL(`${BASE_URL}/api/tracks`);

        if (where) {
          if (where.id) {
            newUrl.searchParams.append("query", where.id);
            newUrl.searchParams.append("field", "id");
          } else if (where.title) {
            newUrl.searchParams.append("field", "*");
            newUrl.searchParams.append("query", where.title ?? "");
          }
        }

        if (sortBy) {
          newUrl.searchParams.append(
            "orderByField",
            mapTrackSortField(sortBy.field),
          );
          newUrl.searchParams.append(
            "orderByDirection",
            sortBy.order.toLowerCase(),
          );
        }

        const response = await fetch(newUrl.toString());
        const { data } = await response.json();
        return data;
      },
    });
  },

  useTrackLoadEvent: (_debounce) => {
    const [state, setState] = useState<LoadedTracks>({
      current: 0,
      total: 0,
    });

    useEffect(() => {
      const eventSource = new EventSource(`${BASE_URL}/api/tracks/load/sse`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "status") return;

        const { current, total } = data;

        setState({ current, total });
      };

      return () => {
        eventSource.close();
      };
    }, []);

    return state;
  },

  useFavoriteTrack: () => {
    return useMutation({
      mutationFn: async ({ trackId, value }) => {
        const response = await fetch(
          `${BASE_URL}/api/tracks/favorite/${trackId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ value: value ?? true }),
          },
        );

        const { data } = await response.json();
        return data;
      },
    });
  },

  useTrackLyrics: (trackId) => {
    return useQuery({
      queryKey: [CACHE_KEY.LYRICS, trackId],
      queryFn: async () => {
        const response = await fetch(`${BASE_URL}/api/lyrics/${trackId}`);
        const { data } = await response.json();

        return data;
      },
    });
  },
};
