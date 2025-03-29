import gql from "graphql-tag";

export const GET_ALL_RECRUITMENTS = gql`
  query CcApplications {
    ccApplications {
      _id
      uid
      teams
      whyCc
      whyThisPosition
      ideas
      ideas1
      otherBodies
      goodFit
      sentTime
      designExperience
    }
  }
`;

export const HAVE_APPLIED = gql`
  query HaveAppliedForCC {
    haveAppliedForCC
  }
`;
