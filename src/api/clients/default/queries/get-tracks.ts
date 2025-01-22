export const GET_TRACKS = /*GraphQL*/ `
    query GetTracks {
        tracks {
            id
            title
            path
            artists {
                id
                name
            }
        }
    }
`;
