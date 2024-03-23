import gql from "graphql-tag";

export const GET_ALL_RECRUITMENTS = gql`
  query CcApplications {
    ccApplications {
      _id
      uid
      otherBodies
      teams
      whyCc
      whyThisPosition
      sentTime
    }
  }
`;
