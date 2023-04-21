import { gql } from "@apollo/client";

export const GET_MEMBERS = gql`
    query Members($clubInput: SimpleClubInput!) {
        members(clubInput: $clubInput) {
            uid
            poc
            roles {
                rid
                name
                startYear
                endYear
                approved
                deleted
            }
        }
    }
`;

export const GET_PENDING_MEMBERS = gql`
    query PendingMembers {
        pendingMembers {
            cid
            uid
            poc
            roles {
                rid
                name
                startYear
                endYear
                approved
                deleted
            }
        }
    }
`;
