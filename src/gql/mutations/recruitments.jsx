import gql from "graphql-tag";

export const CREATE_RECRUITMENT = gql`
    mutation CcApply($ccRecruitmentInput: CCRecruitmentInput!) {
        ccApply(ccRecruitmentInput: $ccRecruitmentInput)
    }
`;