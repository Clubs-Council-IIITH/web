import moment from "moment-timezone";

const timezone = moment.tz.guess() || "UTC";

export function fDate(date, newFormat) {
  const fm = newFormat || "D MMM yyyy";
  return date ? moment.utc(date).tz(timezone).format(fm) : "";
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || "D MMM yyyy, H:mm";
  return date ? moment.utc(date).tz(timezone).format(fm) : "";
}

export function fTimestamp(date) {
  return date ? moment.utc(date).tz(timezone).unix() : "";
}

export function fToNow(date) {
  return date ? moment.utc(date).tz(timezone).fromNow() : "";
}

export function fToISO(datetime) {
  return datetime ? moment.tz(datetime, timezone).utc().toISOString() : "";
}

export function fFromISO(datetime) {
  return datetime ? moment.utc(datetime).tz(timezone) : "";
}
