import { notFound, redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import { getClient, combineQuery } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import {
  GET_FULL_EVENT,
  GET_REPORTS_SUBMISSION_STATUS,
  GET_UNFINISHED_EVENTS,
} from "gql/queries/events";

import EventForm from "components/events/EventForm";

export const metadata = {
  title: "New Event",
};

function transformDateTime(datetimeperiod) {
  let start = new Date(datetimeperiod[0]);
  let end = new Date(datetimeperiod[1]);

  let duration = end - start;

  let newStart = new Date();
  newStart.setDate(new Date().getDate() + 7);
  let newEnd = new Date(newStart.getTime() + duration);

  return [newStart, newEnd];
}

function transformEvent(event) {
  return {
    ...event,
    // parse datetime strings to date objects
    datetimeperiod: transformDateTime(event?.datetimeperiod),
    budget: [],
    sponsor: [],
    location: [],
    locationAlternate: [],
    // parse population as int
    population: parseInt(event?.population || 0),
    // default fallbacks for text fields
    additional: event?.additional || "",
    equipment: event?.equipment || "",
    poc: event?.poc,
    collabclubs: [],
  };
}

export default async function CopyEvent(props) {
  const params = await props.params;
  const { id } = params;

  try {
    const { document, variables } = combineQuery("CombinedCopyEventQuery")
      .add(GET_USER, { userInput: null })
      .add(GET_UNFINISHED_EVENTS, {
        clubid: null,
        public: false,
        excludeCompleted: true,
      })
      .add(GET_FULL_EVENT, { eventid: id });
    const { data } = await getClient().query(document, variables);
    const { userMeta, userProfile, events, event } = data;
    const user = { ...userMeta, ...userProfile };

    const { data: { isEventReportsSubmitted } = {} } = await getClient().query(
      GET_REPORTS_SUBMISSION_STATUS,
      {
        clubid: userMeta?.role === "club" ? userMeta.uid : null,
      },
    );

    let oldEventId = event._id;

    // Delete the fields that we don't want to copy
    delete event._id;
    delete event.code;
    delete event.budget;
    delete event.sponsor;
    delete event.status;
    delete event.location;
    delete event.otherLocation;
    delete event.locationAlternate;
    delete event.otherLocationAlternate;
    delete event.eventReportSubmitted;

    return (
      user?.role === "club" &&
        user?.uid !== event.clubid &&
        !event?.collabclubs.includes(user?.uid) &&
        redirect("/404"),
      (
        <Container>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              mb: 3,
            }}
          >
            Create a New Event
          </Typography>
          <EventForm
            defaultValues={transformEvent(event)}
            existingEvents={events.filter((e) => e._id !== oldEventId)}
            action="create"
            isReportSubmitted={isEventReportsSubmitted}
          />
        </Container>
      )
    );
  } catch (error) {
    notFound();
  }
}
