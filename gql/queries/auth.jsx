import { gql } from "@apollo/client";

export const GET_PROFILE = gql`
    query GetProfile($userInput: UserInput) {
        getProfile(userInput: $userInput) {
            email
            firstName
            lastName
        }
    }
`;
