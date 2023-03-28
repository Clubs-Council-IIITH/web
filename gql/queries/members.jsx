import { gql } from "@apollo/client";

export const GET_MEMBERS = gql`
    query Members($clubInput: SimpleClubInput!) {
        members(clubInput: $clubInput) {
            cid
            uid
            startYear
            role
            approved
        }
    }
`;

export const GET_PENDING_MEMBERS = gql`
    query PendingMembers {
        pendingMembers {
            cid
            uid
            startYear
            role
            approved
        }
    }
`;
