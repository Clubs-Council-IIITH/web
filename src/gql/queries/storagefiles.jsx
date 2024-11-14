import gql from "graphql-tag";

export const GET_ALL_FILES = gql`
  query GetStorageFiles($filetype: String!) {
    storagefiles(filetype: $filetype) {
      _id
      title
      url
      modifiedTime
    }
  }
`;
