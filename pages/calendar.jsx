import moment from "moment";
import { useContext, useState, useEffect } from "react";
import { Container } from "@mui/material";
import { useQuery } from "@apollo/client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Page from "components/Page";
import { GET_ALL_EVENTS } from "gql/queries/events.jsx";
import "react-big-calendar/lib/css/react-big-calendar.css";

const EventCalendar = () => {
    const localizer = momentLocalizer(moment);
    const { data, loading } = useQuery(GET_ALL_EVENTS, {
        pollInterval: 1000 * 60 * 5, // 5 minutes
    });
    const [events, setEvents] = useState([]);
    useEffect(() => {
        setEvents(
            data?.allEvents?.map((e) => ({
                start: moment(e.datetimeStart).toDate(),
                end: moment(e.datetimeEnd).toDate(),
                title: e.name,
            })) || []
        );
    }, [data]);

    return (
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
