
export function parseMy(v) {
  if (v == null || v === "")
    return [new Date().getMonth() + 1, new Date().getFullYear()];
  if (Array.isArray(v) && v.length === 2)
    return [parseInt(v[0]), parseInt(v[1])];
  if (typeof v === "string") {
    const s = v.trim();
    const parts = s.includes("-") ? s.split("-") : s.split("/");
    if (parts.length === 2) {
      const mm = parseInt(parts[0]);
      const yy = parseInt(parts[1]);
      if (!isNaN(mm) && !isNaN(yy)) return [mm, yy];
    }
  }
  return [new Date().getMonth() + 1, new Date().getFullYear()];
}

export function fmtMy(my) {
  if (!Array.isArray(my) || my.length !== 2) return "";
  return `${String(my[0]).padStart(2, "0")}-${my[1]}`;
}

export function clampMy([m, y], [minM, minY], [maxM, maxY]) {
  if (y < minY) return [minM, minY];
  if (y > maxY) return [maxM, maxY];
  let mm = Math.min(12, Math.max(1, parseInt(m)));
  if (y === minY && mm < minM) mm = minM;
  if (y === maxY && mm > maxM) mm = maxM;
  return [mm, y];
}

export function gteMy(a, b) {
  if (a == null || b == null) return false;
  if (a[1] !== b[1]) return a[1] > b[1];
  return a[0] >= b[0];
}

export function eqMy(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a == null && b == null;
  return Array.isArray(a) && Array.isArray(b) && a[0] === b[0] && a[1] === b[1];
}

// For sorting formatted strings like 'MM-YYYY' or '-' (ongoing)
export function myComparator(a, b) {
  const toKey = (s) => {
    if (!s || s === "-") return Number.POSITIVE_INFINITY; // ongoing first in desc
    const [m, y] = s.split("-").map((x) => parseInt(x));
    return y * 12 + m;
  };
  const ka = toKey(a);
  const kb = toKey(b);
  return ka - kb;
}
