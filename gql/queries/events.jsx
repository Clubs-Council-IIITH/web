import { gql } from "@apollo/client";

export const GET_CLUB_EVENTS = gql`
    query ClubEvents($clubid: String, $clubInput: SimpleClubInput!) {
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

export const GET_APPROVED_EVENTS = gql`
    query ApprovedEvents($clubid: String, $clubInput: SimpleClubInput!) {
        approvedEvents(clubid: $clubid) {
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

export const GET_PENDING_EVENTS = gql`
    query PendingEvents($clubid: String) {
        pendingEvents(clubid: $clubid) {
            name
            clubid
            datetimeperiod
            status {
                budget
                room
                state
            }
        }
    }
`;

export const GET_ALL_EVENTS = gql`
    query Events($clubid: String) {
        events(clubid: $clubid) {
            _id
            name
            clubid
            datetimeperiod
            status {
                state
                room
                budget
            }
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

export const GET_FULL_EVENT = gql`
    query Event($eventid: String!) {
        event(eventid: $eventid) {
            _id
            additional
            audience
            budget {
                amount
                description
                reimbursable
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
