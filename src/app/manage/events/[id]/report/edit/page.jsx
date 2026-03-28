import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import { getClient, combineQuery } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_FULL_EVENT } from "gql/queries/events";
import { GET_EVENT_REPORT } from "gql/queries/events";

import EventReportForm from "components/events/report/EventReportForm";
import { canEditReport } from "utils/eventReportAuth";

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

export default async function EditEventReport(props) {
  const params = await props.params;
  const { id } = params;
  try {
    // using graphQl-combine to merge get_user, get_full_event and get_event_report requests
    const { document, variables } = combineQuery("CombinedEventReportQuery")
      .add(GET_USER, { userInput: null })
      .add(GET_FULL_EVENT, { eventid: id })
      .add(GET_EVENT_REPORT, { eventidReport: id });

    const { data = {} } = await getClient().query(document, variables);
    const { userMeta, userProfile, event, eventReport } = data;
    const user = { ...userMeta, ...userProfile };

    if (
      !event ||
      (user?.uid !== event.clubid && !["cc", "slo"].includes(user?.role)) ||
      event.status.state !== "approved"
    ) {
      return redirect("/404");
    } else if (!event?.eventReportSubmitted) {
      return redirect(`/manage/events/${event?._id}/report/new`);
    }

    const AllowEditReport = canEditReport(event, eventReport, user);
    if (!eventReport) {
      return redirect(`/manage/events/${event?._id}/report/new`);
    } else if (!AllowEditReport) {
      return redirect("/404");
    }

    return (
      <Container>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            mb: 3,
          }}
        >
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
