import gql from "graphql-tag";

export const GET_EVENT_ID_FROM_CODE = gql`
  query Query($code: String!) {
    eventid(code: $code)
  }
`;

export const GET_RECENT_EVENTS = gql`
  query RecentEvents {
    recentEvents {
      _id
      name
      code
      clubid
      datetimeperiod
      poster
    }
  }
`;

export const GET_CLUB_EVENTS = gql`
  query ClubEvents($clubid: String, $clubInput: SimpleClubInput!, $public: Boolean) {
    events(clubid: $clubid, public: $public) {
      _id
      name
      code
      clubid
      datetimeperiod
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

export const GET_APPROVED_EVENTS = gql`
  query ApprovedEvents($clubid: String, $clubInput: SimpleClubInput!) {
    approvedEvents(clubid: $clubid) {
      _id
      name
      code
      clubid
      datetimeperiod
      poster
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
      datetimeperiod
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
      datetimeperiod
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
      datetimeperiod
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
      datetimeperiod
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
      }
    }
  }
`;

export const GET_AVAILABLE_LOCATIONS = gql`
  query AvailableRooms($timeslot: [DateTime!]!, $eventid: String) {
    availableRooms(timeslot: $timeslot, eventid: $eventid) {
      locations
    }
  }
`;
