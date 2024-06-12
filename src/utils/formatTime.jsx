"do not use client! just fix IST for everything";
import dayjs from "dayjs";

export function appendWeekday(dateString) {
  const dateObj = getDateObj(dateString);
  console.log(dateObj);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  const formattedDate = formatter.format(dateObj);
  return String(formattedDate);
}

export function shortDateStr(dateString) {
  const dateObj = getDateObj(dateString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    month: 'short',
    day: 'numeric',
  });

  const formattedDate = formatter.format(dateObj);
  return String(formattedDate);
}

export function getDateObj(dateStr){
  // use regex to record arguments and pass into Date()
  return new Date(dateStr.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5"))
}

export function getDateStr(date) {
  const dayjsDate = dayjs(date);
  return dayjsDate.format('DD-MM-YYYY HH:mm');
}

export function getDuration(startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const diffInSeconds = end.diff(start, 'seconds');
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}
