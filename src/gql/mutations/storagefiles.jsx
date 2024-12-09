import gql from "graphql-tag";

export const CREATE_STORAGEFILE = gql`
  mutation CreateStorageFile($details: StorageFileInput!) {
    createStorageFile(details: $details) {
      _id
    }
  }
`;

export const UPDATE_STORAGEFILE = gql`
  mutation UpdateStorageFile($fileId: String!) {
    updateStorageFile(id: $fileId)
  }
`;

export const DELETE_STORAGEFILE = gql`
  mutation DeleteStorageFile($fileId: String!) {
    deleteStorageFile(id: $fileId)
  }
`;
