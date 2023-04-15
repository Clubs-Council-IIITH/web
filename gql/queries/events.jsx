import { gql } from "@apollo/client";

export const GET_CLUB_EVENTS = gql`
    query Events($clubid: String, $clubInput: SimpleClubInput!) {
        events(clubid: $clubid) {
            _id
            name
            datetimeperiod
            poster
        }
        club(clubInput: $clubInput) {
            banner
        }
    }
`;

export const GET_EVENT = gql`
    query Event($eventid: String!) {
        event(eventid: $eventid) {
            _id
            name
            clubid
            location
            audience
            description
            datetimeperiod
            link
            poster
        }
    }
`;
