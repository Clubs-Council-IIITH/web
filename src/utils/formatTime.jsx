"do not use client! just fix IST for everything";

export function appendWeekday(date) {
  const dateObj = getDateObj(dateString)
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
  const weekday = formatter.format(dateObj);

  return `${weekday} ${date}`;
}

export function getDateObj(dateStr){
  // use regex to record arguments and pass into Date()
  return new Date(dateStr.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5"))
}

export function getDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function getDuration(startDate, endDate) {
  const duration = endDate - startDate;
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}
