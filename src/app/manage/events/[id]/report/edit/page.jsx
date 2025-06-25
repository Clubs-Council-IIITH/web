import { getClient } from "gql/client";
import { GET_FULL_EVENT } from "gql/queries/events";
import { GET_EVENT_REPORT } from "gql/queries/events";
import { redirect } from "next/navigation";
import { GET_USER } from "gql/queries/auth";

import { Container, Typography } from "@mui/material";

const REPORT_EDIT_ACCESS_TIME = 2 * 24 * 60 * 60 * 1000;
const REPORT_EDIT_ACCESS_TIME_SLO = 14 * 24 * 60 * 60 * 1000;

import EventReportForm from "components/events/report/EventReportForm";

export const metadata = {
  title: "Edit Event Report",
};

function transformEvent(event) {
  return {
    ...event,
    datetimeperiod: [
      new Date(event?.datetimeperiod[0]),
      new Date(event?.datetimeperiod[1]),
    ],
    budget:
      event?.budget?.map((budget, key) => ({
        ...budget,
        id: budget?.id || key,
      })) || [],
    population: parseInt(event?.population || 0),
    additional: event?.additional || "",
    equipment: event?.equipment || "",
    poc: event?.poc,
    collabclubs: event?.collabclubs || [],
  };
}

const canEditReport = (event, eventReport, user) => {
  if (!eventReport?.submittedTime || !user?.role) return false;

  const timeElapsed = new Date().getTime() - new Date(eventReport.submittedTime).getTime();

  if (["club"].includes(user.role) && user.uid==event.clubid) {
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

export default async function EditEventReport({ params }) {
  const { id } = params;
  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = { ...userMeta, ...userProfile };

  try {
    const { data: { event } = {} } = await getClient().query(GET_FULL_EVENT, {
      eventid: id,
    });
    if (
      !event ||
      (user?.uid !== event.clubid && !["cc","slo"].includes(user?.role)) ||
      event.status.state !== "approved"
    ) {
      return redirect("/404");
    } else if (!event?.eventReportSubmitted) {
      return redirect(`/manage/events/${event?._id}/report/new`);
    }
    const { data: { eventReport } = {} } = await getClient().query(
      GET_EVENT_REPORT,
      {
        eventid: id,
      },
    );

    const AllowEditReport = canEditReport(event, eventReport, user);
    if (!eventReport) {
      return redirect(`/manage/events/${event?._id}/report/new`);
    } else if (!AllowEditReport) {
      return redirect("/404");
    }

    return (
      <Container>
        <Typography variant="h3" gutterBottom mb={3}>
          Edit Event Report
        </Typography>

        <EventReportForm
          id={id}
          defaultValues={transformEvent(event)}
          defaultReportValues={eventReport}
          action="edit"
        />
      </Container>
    );
  } catch (error) {
    return redirect("/404");
  }
}
