// Format month/year from separate fields
// Editing flows should initialize month separately where needed
export function fmtMonthYear(month, year, forceMonth = false) {
  if (!year) return "present";
  if (month == null || month === "")
    return forceMonth ? `${year}-01` : `${year}`;
  const mm = String(month).padStart(2, "0");
  return `${year}-${mm}`;
}

// Sorts dates
export function sortMonthYear(a, b) {
  const aEnd = a?.endYear;
  const bEnd = b?.endYear;
  if (aEnd == null && bEnd == null) return 0;
  if (aEnd == null) return -1;
  if (bEnd == null) return 1;
  if (bEnd !== aEnd) return bEnd - aEnd;
  return b?.endMonth - a?.endMonth;
}

// For sorting formatted strings like 'MM-YYYY' or '-' (ongoing)
export function compareMonthYear(a, b) {
  const toKey = (s) => {
    if (!s || s === "present") return Number.POSITIVE_INFINITY; // ongoing first in desc
    if (s.includes("-")) {
      const [y, m] = s.split("-").map((x) => parseInt(x, 10));
      return y * 12 + (Number.isNaN(m) ? 0 : m);
    }
    // If only year is provided
    const y = parseInt(s, 10);
    return y * 12;
  };
  const ka = toKey(a);
  const kb = toKey(b);
  return ka - kb;
}
