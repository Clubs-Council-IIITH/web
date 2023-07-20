"use client";

import stc from "string-to-color";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function eventDataTransform(event) {
  return {
    id: event._id,
    title: event.name,
    start: new Date(event.datetimeperiod[0]),
    end: new Date(event.datetimeperiod[1]),
    backgroundColor: stc(event.clubid),
    url: `/events/${event._id}`,
    display: "block",
  };
}

export default function Calendar({ events }) {
  return (
    <FullCalendar
      events={events}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      eventDataTransform={eventDataTransform}
    />
  );
}
