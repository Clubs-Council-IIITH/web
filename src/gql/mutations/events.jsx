import gql from "graphql-tag";

export const CREATE_EVENT = gql`
  mutation CreateEvent($details: InputEventDetails!) {
    createEvent(details: $details) {
      _id
    }
  }
`;

export const EDIT_EVENT = gql`
  mutation EditEvent($details: InputEditEventDetails!) {
    editEvent(details: $details) {
      _id
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($eventid: String!) {
    deleteEvent(eventid: $eventid) {
      _id
    }
  }
`;

export const PROGRESS_EVENT = gql`
  mutation ProgressEvent(
    $eventid: String!
    $ccProgressBudget: Boolean
    $ccProgressRoom: Boolean
    $ccApprover: String,
    $slcMembersForEmail: [String!]
  ) {
    progressEvent(
      eventid: $eventid
      ccProgressBudget: $ccProgressBudget
      ccProgressRoom: $ccProgressRoom
      ccApprover: $ccApprover
      slcMembersForEmail: $slcMembersForEmail
    ) {
      _id
    }
  }
`;
