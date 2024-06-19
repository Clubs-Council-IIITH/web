"use client";

import stc from "string-to-color";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAuth } from "components/AuthProvider";

function eventDataTransform(event, role, uid) {
  if (event.status.state === "approved") {
    return {
      id: event._id,
      title: event.name,
      start: new Date(event.datetimeperiod[0]),
      end: new Date(event.datetimeperiod[1]),
      backgroundColor: stc(event.clubid),
      url: `/events/${event._id}`,
      display: "block",
    };
  } else {
    if (role == "cc" || uid == event.clubid)
      return {
        id: event._id,
        title: event.name,
        start: new Date(event.datetimeperiod[0]),
        end: new Date(event.datetimeperiod[1]),
        backgroundColor: stc(event.clubid),
        url: `/manage/events/${event._id}`,
        display: "block",
      };
    else
      return {
        id: event._id,
        title: event.name,
        start: new Date(event.datetimeperiod[0]),
        end: new Date(event.datetimeperiod[1]),
        backgroundColor: stc(event.clubid),
        display: "block",
      };
  }
}

export default function Calendar({ events }) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const eventDataTransform_withrole = (event) => {
    return eventDataTransform(event, user?.role, user?.uid);
  };

  return (
    <FullCalendar
      events={events?.filter((event) => event?.status?.state !== "deleted")}
      plugins={[dayGridPlugin, listPlugin]}
      initialView={isMobile ? "listWeek" : "dayGridMonth"}
      eventDataTransform={eventDataTransform_withrole}
    />
  );
}
