import { gql } from "@apollo/client";

export const GET_SIGNED_UPLOAD_URL = gql`
  query SignedUploadURL {
    signedUploadURL {
      url
    }
  }
`;
