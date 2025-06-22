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
  query Events(
    $clubid: String
    $name: String
    $paginationOn: Boolean
    $skip: Int
    $limit: Int
    $public: Boolean
    $timings: [DateTime!]
    $location: [Event_Location!]
  ) {
    events(
      clubid: $clubid
      name: $name
      paginationOn: $paginationOn
      skip: $skip
      limit: $limit
      public: $public
      timings: $timings
      location: $location
    ) {
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
      locationAlternate
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

export const GET_CLASHING_EVENTS = gql`
  query ClashingEvents($eventId: String!) {
    clashingEvents(id: $eventId) {
      _id
    }
  }
`;

export const GET_EVENT_BILLS_STATUS = gql`
  query EventBillsStatus($eventid: String!) {
    eventBills(eventid: $eventid) {
      state
      sloComment
      updatedTime
      filename
      submittedTime
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
      eventReportSubmitted
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
        billno
        amountUsed
      }
      clubid
      collabclubs
      clubCategory
      datetimeperiod
      description
      equipment
      link
      location
      locationAlternate
      mode
      name
      population
      externalPopulation
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
      eventReportSubmitted
    }
  }
`;

export const GET_EVENT_BUDGET = gql`
  query Event($eventid: String!) {
    event(eventid: $eventid) {
      _id
      code
      budget {
        amount
        description
        advance
        billno
        amountUsed
      }
      clubid
      name
      status {
        state
      }
      eventReportSubmitted
    }
  }
`;

export const GET_AVAILABLE_LOCATIONS = gql`
  query AvailableRooms($timeslot: [DateTime!]!, $eventid: String) {
    availableRooms(timeslot: $timeslot, eventid: $eventid) {
      locations {
        location
        available
      }
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

export const GET_EVENT_REPORT = gql`
  query EventReport($eventid: String!) {
    eventReport(eventid: $eventid) {
      eventid
      summary
      attendance
      externalAttendance
      prizes
      prizesBreakdown
      winners
      photosLink
      feedbackCc
      feedbackCollege
      submittedBy
      submittedTime
    }
  }
`;
