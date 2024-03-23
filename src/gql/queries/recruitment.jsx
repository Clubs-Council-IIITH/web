import gql from "graphql-tag";

export const GET_ALL_RECRUITMENTS = gql`
  query CcApplications {
    ccApplications {
      _id
      batch
      designExperience
      email
      lastName
      firstName
      phone
      otherBodies
      rollno
      sentTime
      stream
      whyCc
      teams
      whyThisPosition
    }
  }
`;
