export const canEditReport = (event, eventReport, user) => {
  const REPORT_EDIT_ACCESS_TIME = 2 * 24 * 60 * 60 * 1000;
  const REPORT_EDIT_ACCESS_TIME_SLO = 14 * 24 * 60 * 60 * 1000;

  if (!eventReport?.submittedTime || !user?.role) return false;

  const timeElapsed =
    new Date().getTime() - new Date(eventReport.submittedTime).getTime();

  if (["club"].includes(user.role) && user.uid == event.clubid) {
    return timeElapsed < REPORT_EDIT_ACCESS_TIME;
  }

  if (["cc"].includes(user.role)) {
    return timeElapsed < REPORT_EDIT_ACCESS_TIME;
  }

  if (["slo"].includes(user.role)) {
    return timeElapsed < REPORT_EDIT_ACCESS_TIME_SLO;
  }

  return false;
};

export const isEventsReportSubmitted = (events, userMeta) => {
  const DAYS = 7 * 24 * 60 * 60 * 1000;
  const START_DATE = new Date("2025-11-10").getTime();
  const cutoff = Date.now() - DAYS;

  const pastEvents = events.filter(e =>
    e.clubid === userMeta?.uid &&
    new Date(e?.datetimeperiod?.[1]) < cutoff &&
    new Date(e?.datetimeperiod?.[1]) > START_DATE
  );

  return !(userMeta?.role === "club" && pastEvents.some(e => !e.eventReportSubmitted));
};
