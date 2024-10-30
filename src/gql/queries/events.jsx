import gql from "graphql-tag";

export const GET_EVENT_ID_FROM_CODE = gql`
  query Query($code: String!) {
    eventid(code: $code)
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
  query Events($clubid: String, $name: String, $paginationOn: Boolean, $skip: Int, $limit: Int, $public: Boolean) {
    events(clubid: $clubid, name: $name, paginationOn: $paginationOn, skip: $skip, limit: $limit,  public: $public) {
      _id
      name
      code
      clubid
      collabclubs
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

export const GET_ALL_PUBLIC_EVENTS = gql`
  query Events($clubid: String, $limit: Int) {
    events(clubid: $clubid, public: true, limit: $limit) {
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
  }
`;

export const GET_EVENT = gql`
  query Event($eventid: String!) {
    event(eventid: $eventid) {
      _id
      name
      code
      clubid
      collabclubs
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

export const GET_EVENT_STATUS = gql`
  query Event($eventid: String!) {
    event(eventid: $eventid) {
      _id
      code
      clubid
      name
      status {
        state
        room
        budget
      }
    }
  }
`;

export const GET_EVENT_BILLS_STATUS = gql`
  query EventBillsStatus($eventid: String!) {
    eventBills(eventid: $eventid) {
      state
      sloComment
      updatedTime
    }
  }
`;

export const GET_ALL_EVENTS_BILLS_STATUS = gql`
  query AllEventsBillsStatus {
    allEventsBills {
      eventid
      eventname
      clubid
      billsStatus {
        state
        sloComment
        updatedTime
      }
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
      collabclubs
      studentBodyEvent
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
        lastUpdatedTime
        lastUpdatedBy
        submissionTime
        ccApprover
        ccApproverTime
        slcApprover
        slcApproverTime
        sloApproverTime
        deletedBy
        deletedTime
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

export const DOWNLOAD_EVENTS_DATA = gql`
  query DownloadEventsData($details: InputDataReportDetails!) {
    downloadEventsData(details: $details) {
      csvFile
    }
  }
`;



// construct graphql query based on type
export function constructQuery({ type, clubid, paginationOn=false,skip, limit }) {
  if (type === "recent") {
    return [
      GET_ALL_EVENTS,
      {
        clubid: null,
        limit: limit || 12,
        skip: skip || 0,
        public: true,
      },
    ];
  } else if (type === "club") {
    return [
      GET_ALL_EVENTS,
      {
        clubid,
        public: true,
      },
    ];
  } else if (type === "all") {
    return [
      GET_ALL_EVENTS,
      {
        clubid: null,
        pagination: paginationOn,
        limit: limit || 12,
        skip: skip || 0,
        public: true,
      },
    ];
  } else {
    throw new Error("Invalid event type");
  }
}
