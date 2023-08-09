import gql from "graphql-tag";

export const UPDATE_USERDATA = gql`
  mutation UpdateUserData($userDataInput: UserDataInput!) {
    updateUserData(userDataInput: $userDataInput)
  }
`;
