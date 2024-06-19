import gql from "graphql-tag";

export const CREATE_HOLIDAY = gql`
  mutation CreateHoliday($details: InputHolidayDetails!) {
    createHoliday(details: $details) {
      _id
    }
  }
`;

export const EDIT_HOLIDAY = gql`
  mutation EditHoliday(
    $editHolidayId: String!
    $details: InputHolidayDetails!
  ) {
    editHoliday(id: $editHolidayId, details: $details) {
      _id
    }
  }
`;

export const DELETE_HOLIDAY = gql`
  mutation DeleteHoliday($holidayId: String!) {
    deleteHoliday(id: $holidayId) {
      _id
    }
  }
`;
