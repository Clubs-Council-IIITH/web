"use client";

import { AddToCalendarButton } from "add-to-calendar-button-react";
import { useMode } from "contexts/ModeContext";
import { locationLabel } from "utils/formatEvent";

export default function AddToCalendarBtn({ event }) {
  const { isDark } = useMode();
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateString = date.toISOString().substring(0, 10); // YYYY-MM-DD
    const timeString = date.toTimeString().substring(0, 5); // HH:MM
    return { dateString, timeString };
  };

  const startDateTime = formatDateTime(event.datetimeperiod[0]);
  const endDateTime = formatDateTime(event.datetimeperiod[1]);
  return (
    <AddToCalendarButton
      name={event.name}
      description={event.description || " "}
      options={["Apple", "Google", "Outlook.com"]}
      location={
        ["offline", "hybrid"].includes(event.mode)
          ? event.location.length > 0
            ? event.location.map((l) => locationLabel(l).name).join(", ")
            : event.mode.charAt(0).toUpperCase() + event.mode.slice(1)
          : "Online"
      }
      startDate={startDateTime.dateString}
      endDate={endDateTime.dateString}
      lightMode={isDark ? "dark" : "light"}
      startTime={startDateTime.timeString}
      endTime={endDateTime.timeString}
      hideBranding={true}
      hideBackground={true}
      forceOverlay={true}
      hideCheckmark={true}
      size={2}
      pastDateHandling="hide"
      timeZone="Asia/Calcutta"
    ></AddToCalendarButton>
  );
}
