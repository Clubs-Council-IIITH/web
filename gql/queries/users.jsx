import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userInput: UserInput!) {
    userProfile(userInput: $userInput) {
      firstName
      lastName
      email
      gender
    }
    userMeta(userInput: $userInput) {
      img
    }
  }
`;
