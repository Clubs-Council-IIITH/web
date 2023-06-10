import momenttz from "moment-timezone";

import { useState, useEffect } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS } from "gql/queries/events.jsx";

import { Container } from "@mui/material";
import Page from "components/Page";
import { fDateTime } from "utils/formatTime";
import useResponsive from "hooks/useResponsive";

import { useProgressbar } from "contexts/ProgressbarContext";

const EventCalendar = () => {
    const isDesktop = useResponsive("up", "sm");
    const localizer = momentLocalizer(momenttz);
    const [events, setEvents] = useState([]);

    const { loading } = useQuery(GET_ALL_EVENTS, {
        variables: {
            clubid: null,
        },
        onCompleted: ({ events: allEvents }) => {
            setEvents(
                allEvents?.map((e) => ({
                    start: fDateTime(e.datetimeperiod[0], 'YYYY-MM-DDTHH:mm:ss'),
                    end: fDateTime(e.datetimeperiod[1], 'YYYY-MM-DDTHH:mm:ss'),
                    title: e.name,
                })) || []
            );
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return loading ? null : (
        <Page title="Calendar">
            <Container>
                <Calendar
                    defaultDate={new Date()}
                    defaultView={isDesktop ? "month" : "agenda"}
                    localizer={localizer}
                    events={events}
                    style={{ height: "80vh" }}
                />
            </Container>
        </Page>
    );
};

export default EventCalendar;
