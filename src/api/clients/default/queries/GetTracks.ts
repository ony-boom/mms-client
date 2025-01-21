import { gql } from "@apollo/client/core";

export const GET_TRACKS = gql`
    query GetTracks {
        tracks {
            title
            path
        }
    }
`;