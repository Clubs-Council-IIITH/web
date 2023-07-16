import { gql } from "@apollo/client";

export const UPDATE_IMG = gql`
  mutation UpdateImage($imgInput: ImageInput!) {
    updateImage(imgInput: $imgInput)
  }
`;
