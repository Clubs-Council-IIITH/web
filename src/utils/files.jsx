export function getFile(filepath) {
  if (filepath?.toLowerCase()?.startsWith("http")) {
    // return the full URL if global URL
    return filepath;
  } else if (filepath) {
    // call files service if local URL
    return `/files/download?filename=${filepath}`;
  }
}
