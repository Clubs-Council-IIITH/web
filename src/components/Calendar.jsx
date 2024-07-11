"use client";

import { useEffect, useRef } from "react";
import stc from "string-to-color";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Tooltip, Typography, Fade } from "@mui/material";

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
  const calendarRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const eventDataTransform_withrole = (event) => {
    return eventDataTransform(event, user?.role, user?.uid);
  };

  const allEvents = events?.filter(
    (event) => event?.status?.state !== "deleted"
  );
  const mergedEvents = [...allEvents, ...holidays];

  useEffect(() => {
    if (calendarRef.current) {
      if (isMobile) {
        calendarRef.current.getApi().changeView("listWeek");
      } else {
        calendarRef.current.getApi().changeView("dayGridMonth");
      }
    }
  }, [isMobile]);

  function renderInnerContent(innerProps) {
    return (
      <div className="fc-event-main-frame">
        {innerProps.timeText && (
          <div className="fc-event-time">{innerProps.timeText}</div>
        )}
        <div className="fc-event-title-container">
          <div className="fc-event-title fc-sticky">
            {innerProps.event.title || <Fragment>&nbsp;</Fragment>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        events={mergedEvents}
        plugins={[dayGridPlugin, listPlugin]}
        initialView={"dayGridMonth"}
        eventDataTransform={eventDataTransform_withrole}
        headerToolbar={{
          left: "title",
          right: "prev,next",
        }}
        eventContent={(arg) => {
          return (
            <Tooltip
              title={
                <div style={{ userSelect: "none" }}>
                  <Typography variant="body2">
                    <strong>{arg.event.title}</strong>{" "}
                    {arg.event.extendedProps.clubid ? "by" : ""}{" "}
                    {arg.event.extendedProps.clubid
                      ? allClubs.find(
                          (club) => club.cid === arg.event.extendedProps.clubid
                        )?.name
                      : "Holiday"}
                  </Typography>
                </div>
              }
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 500 }}
              arrow
              placement="top"
              enterDelay={300}
              interactive
              describeChild
            >
              <div style={{ userSelect: "none" }}>
                {renderInnerContent(arg)}
              </div>
            </Tooltip>
          );
        }}
      />
      <style>{`
        .fc .fc-bg-event {
          background-color: ${theme.palette.background.error}!important;
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
}
