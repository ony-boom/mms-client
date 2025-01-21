export const GET_TRACK_COVER = /*GraphQL*/ `
    query GetTrackCover($trackId: ID!) {
       coverFromTrack(trackId: $trackId) 
    }
`