import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
    mutation CreateEvent($details: InputEventDetails!) {
        createEvent(details: $details) {
            _id
        }
    }
`;
