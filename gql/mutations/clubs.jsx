import { gql } from "@apollo/client";

export const CREATE_CLUB = gql`
    mutation CreateClub($clubInput: NewClubInput!) {
        createClub(clubInput: $clubInput) {
            cid
            state
            name
        }
    }
`;
