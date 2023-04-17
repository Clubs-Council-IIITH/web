import { gql } from "@apollo/client";

export const CREATE_CLUB = gql`
    mutation CreateClub($clubInput: FullClubInput!) {
        createClub(clubInput: $clubInput) {
            cid
            state
            name
        }
    }
`;

export const EDIT_CLUB = gql`
    mutation EditClub($clubInput: FullClubInput!) {
        editClub(clubInput: $clubInput) {
            cid
            name
            state
        }
    }
`;
