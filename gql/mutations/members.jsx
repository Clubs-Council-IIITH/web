import { gql } from "@apollo/client";

export const CREATE_MEMBER = gql`
    mutation CreateMember($memberInput: FullMemberInput!) {
        createMember(memberInput: $memberInput) {
            _id
        }
    }
`;
