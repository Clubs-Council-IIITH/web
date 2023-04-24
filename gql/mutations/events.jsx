import { gql } from "@apollo/client";

const CREATE_EVENT = gql`
    mutation Mutation($details: InputEventDetails!) {
        createEvent(details: $details) {
            _id
        }
    }
`;
