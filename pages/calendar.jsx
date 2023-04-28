import moment from "moment";

import { useState, useEffect } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS } from "gql/queries/events.jsx";

import { Container } from "@mui/material";
import Page from "components/Page";

const EventCalendar = () => {
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);

    const { loading } = useQuery(GET_ALL_EVENTS, {
        variables: {
            clubid: null,
        },
        onCompleted: ({ allEvents }) => {
            setEvents(
                allEvents?.map((e) => ({
                    start: moment(e.datetimeperiod[0]).toDate(),
                    end: moment(e.datetimeperiod[1]).toDate(),
                    title: e.name,
                })) || []
            );
        },
    });

    return loading ? null : (
        <Page title="Calendar">
            <Container>
                <Calendar
                    defaultDate={new Date()}
                    //defaultView={isTabletOrMobile ? "agenda" : "month"}
                    localizer={localizer}
                    events={events}
                    style={{ height: "80vh" }}
                />
            </Container>
        </Page>
    );
};

export default EventCalendar;
