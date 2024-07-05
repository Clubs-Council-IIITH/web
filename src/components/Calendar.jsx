"use client";

import stc from "string-to-color";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css"; // Optional for styling

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAuth } from "components/AuthProvider";

function eventDataTransform(event, role, uid) {
  if (!event?.status) {
    return {
      id: event._id,
      title: event.name,
      start: new Date(event.date),
      end: new Date(event.date),
      allDay: true,
      display: "background",
      backgroundColor: "#FFCCCB",
      clubid: event.clubid,
    };
  }
  if (event.status.state === "approved") {
    return {
      id: event._id,
      title: event.name,
      start: new Date(event.datetimeperiod[0]),
      end: new Date(event.datetimeperiod[1]),
      backgroundColor: stc(event.clubid),
      url: `/events/${event._id}`,
      display: "block",
      clubid: event.clubid,
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
        clubid: event.clubid,
      };
    else
      return {
        id: event._id,
        title: event.name,
        start: new Date(event.datetimeperiod[0]),
        end: new Date(event.datetimeperiod[1]),
        backgroundColor: stc(event.clubid),
        display: "block",
        clubid: event.clubid,
      };
  }
}

export default function Calendar({ events, holidays, allClubs }) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const eventDataTransform_withrole = (event) => {
    return eventDataTransform(event, user?.role, user?.uid);
  };

  const allEvents = events?.filter(
    (event) => event?.status?.state !== "deleted"
  );
  const mergedEvents = [...allEvents, ...holidays];

  const handleEventMouseEnter = (info) => {
    const { event, el } = info;
    const clubName = allClubs.find((club) => club.cid === event.extendedProps.clubid)?.name;
    const content = `<strong>${event.title}</strong> ${event.extendedProps.clubid ? "by" : ""} ${event.extendedProps.clubid ? clubName : "Holiday"}`;

    tippy(el, {
      content,
      allowHTML: true,
      placement: "top",
    });
  };

  return (
    <FullCalendar
      events={mergedEvents}
      plugins={[dayGridPlugin, listPlugin]}
      initialView={isMobile ? "listWeek" : "dayGridMonth"}
      eventDataTransform={eventDataTransform_withrole}
      eventMouseEnter={handleEventMouseEnter}
    />
  );
}
