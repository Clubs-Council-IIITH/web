import gql from "graphql-tag";

export const GET_EVENT_ID_FROM_CODE = gql`
  query Query($code: String!) {
    eventid(code: $code)
  }
`;

export const GET_CLUB_EVENTS = gql`
  query ClubEvents(
    $clubid: String
    $clubInput: SimpleClubInput!
    $public: Boolean
  ) {
    events(clubid: $clubid, public: $public) {
      _id
      name
      code
      clubid
      startTime
      endTime
      poster
      status {
        state
      }
    }
    club(clubInput: $clubInput) {
      banner
    }
  }
`;

export const GET_PENDING_EVENTS = gql`
  query PendingEvents($clubid: String) {
    pendingEvents(clubid: $clubid) {
      _id
      name
      code
      clubid
      startTime
      endTime
      status {
        state
        room
        budget
      }
      location
      poster
      budget {
        amount
      }
    }
  }
`;

export const GET_ALL_EVENTS = gql`
  query Events($clubid: String, $public: Boolean) {
    events(clubid: $clubid, public: $public) {
      _id
      name
      code
      clubid
      startTime
      endTime
      status {
        state
        room
        budget
      }
      location
      poster
      budget {
        amount
      }
    }
  }
`;

export const GET_EVENT = gql`
  query Event($eventid: String!) {
    event(eventid: $eventid) {
      _id
      name
      code
      clubid
      location
      audience
      description
      startTime
      endTime
      link
      poster
      mode
    }
  }
`;

export const GET_FULL_EVENT = gql`
  query Event($eventid: String!) {
    event(eventid: $eventid) {
      _id
      poc
      code
      additional
      audience
      budget {
        amount
        description
        advance
      }
      clubid
      startTime
      endTime
      description
      equipment
      link
      location
      mode
      name
      population
      poster
      status {
        state
        room
        budget
        ccApproverTime
        slcApproverTime
        sloApproverTime
        submissionTime
      }
    }
  }
`;

export const GET_AVAILABLE_LOCATIONS = gql`
  query AvailableRooms($startTime: String!, $endTime: String!, $eventid: String) {
    availableRooms(inputStart: $startTime, inputEnd: $endTime, eventid: $eventid) {
      locations
    }
  }
`;
