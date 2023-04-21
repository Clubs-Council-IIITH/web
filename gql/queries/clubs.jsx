import { gql } from "@apollo/client";

export const GET_ACTIVE_CLUBS = gql`
    query ActiveClubs {
        activeClubs {
            cid
            state
            category
            banner
            name
            tagline
        }
    }
`;

export const GET_ALL_CLUBS = gql`
    query AllClubs {
        allClubs {
            cid
            state
            category
            logo
            name
            email
            tagline
        }
    }
`;

export const GET_CLUB = gql`
    query Club($clubInput: SimpleClubInput!) {
        club(clubInput: $clubInput) {
            banner
            category
            cid
            description
            email
            logo
            name
            socials {
                website
                instagram
                facebook
                youtube
                twitter
                linkedin
                discord
                otherLinks
            }
            state
            tagline
        }
    }
`;
