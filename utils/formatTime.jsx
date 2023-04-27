import { format, getTime, formatDistanceToNow, formatISO } from "date-fns";

export function fDate(date, newFormat) {
    const fm = newFormat || "dd MMM yyyy";

    return date ? format(new Date(date), fm) : "";
}

export function fDateTime(date, newFormat) {
    const fm = newFormat || "dd MMM yyyy p";

    return date ? format(new Date(date), fm) : "";
}

export function fTimestamp(date) {
    return date ? getTime(new Date(date)) : "";
}

export function fToNow(date) {
    return date
        ? formatDistanceToNow(new Date(date), {
              addSuffix: true,
          })
        : "";
}

export function fToISO(datetime) {
    return datetime ? formatISO(new Date(datetime)) : "";
}

export function fFromISO(datetime) {
    return datetime ? new Date(datetime) : "";
}
