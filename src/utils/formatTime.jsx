"use client";

const LOCALE = "en-IN";

// get datetime components from ISO string
export function ISOtoDateTime(iso) {
  const dt = new Date(iso);

  const options = { hour12: true };
  return {
    weekday: dt.toLocaleString(LOCALE, { weekday: "short", ...options }),
    day: dt.toLocaleString(LOCALE, { day: "numeric", ...options }),
    month: dt.toLocaleString(LOCALE, { month: "short", ...options }),
    year: dt.toLocaleString(LOCALE, { year: "numeric", ...options }),
    time: dt.toLocaleString(LOCALE, { timeStyle: "short", ...options }),
  };
}

// get human readable date time from ISO string
export function ISOtoHuman(iso, weekDay = false) {
  const dt = ISOtoDateTime(iso);
  return `${weekDay ? `${dt.weekday} ` : ""}${dt.day} ${dt.month}${
    dt.year !== String(new Date().getFullYear()) ? ` ${dt.year}` : ""
  }, ${dt.time.toUpperCase()}`;
}
