import gql from "graphql-tag";

export const GET_SIGNED_UPLOAD_URL = gql`
  query SignedUploadURL($details: SignedURLInput, $filename: String = "") {
    signedUploadURL(details: $details) {
      url
    }
  }
`;
