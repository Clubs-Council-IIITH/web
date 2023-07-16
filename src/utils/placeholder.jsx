export function getPlaceholder({ seed, w = 640, h = 480, blur = 5 }) {
  return `https://picsum.photos/seed/${seed.replace(
    / /g,
    "_"
  )}/${w}/${h}?blur=${blur}`;
}
