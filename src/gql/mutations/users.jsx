import gql from "graphql-tag";

export const UPDATE_IMG = gql`
  mutation UpdateImage($imgInput: ImageInput!) {
    updateImage(imgInput: $imgInput)
  }
`;
