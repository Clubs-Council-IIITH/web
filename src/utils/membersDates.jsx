
// Format month/year from separate fields
// Editing flows should initialize month separately where needed
export function fmtMonthYear(month, year) {
  if (!year) return "present";
  if (month == null || month === undefined || month === "") return `${year}`;
  return `${String(month).padStart(2, "0")}-${year}`;
}

// Sorts dates
export function sortMonthYear(a,b)
{
  const aEnd = a?.endYear;
  const bEnd = b?.endYear;
  if (aEnd == null && bEnd != null) return -1;
  if (aEnd != null && bEnd == null) return 1;
  if (aEnd == null && bEnd == null) return 0;
  if (bEnd !== aEnd) return bEnd - aEnd;
  return b?.endMonth - a?.endMonth;
}

// Clamp month/year values
export function clampMonthYear(month, year, minMonth, minYear, maxMonth, maxYear) {
  if (year < minYear) return [1, minYear];
  if (year > maxYear) return [1, maxYear];
  if (month < 1) return [1,year];
  if (month > 12) return [12,year];
  return [month, year];
}

// For sorting formatted strings like 'MM-YYYY' or '-' (ongoing)
export function compareMonthYear(a, b) {
  const toKey = (s) => {
    if (!s || s === "present") return Number.POSITIVE_INFINITY; // ongoing first in desc
    if (s.includes("-"))
    {
      const [m, y] = s.split("-").map((x) => parseInt(x));
      return y * 12 + m;
    }
    return parseInt(s) * 12;
  };
  const ka = toKey(a);
  const kb = toKey(b);
  return ka - kb;
}
