import gql from "graphql-tag";

export const GET_SIGNED_UPLOAD_URL = gql`
  query SignedUploadURL {
    signedUploadURL {
      url
    }
  }
`;
