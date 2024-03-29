import { getClient } from "gql/client";
import { GET_FULL_EVENT } from "gql/queries/events";
import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import EventForm from "components/events/EventForm";

export const metadata = {
  title: "New Event",
};

function transformDateTime(datetimeperiod) {
  let start = new Date(datetimeperiod[0]);
  let end = new Date(datetimeperiod[1]);

  let duration = end - start;

  let newStart = new Date(datetimeperiod[0]);
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
    location: [],
    // parse population as int
    population: parseInt(event?.population || 0),
    // default fallbacks for text fields
    additional: event?.additional || "",
    equipment: event?.equipment || "",
    poc: event?.poc,
  };
}

export default async function CopyEvent({ params }) {
  const { id } = params;

  try {
    const { data: { event } = {} } = await getClient().query(GET_FULL_EVENT, {
      eventid: id,
    });

    // Delete the fields that we don't want to copy
    delete event._id;
    delete event.code;
    delete event.budget;
    delete event.location;
    delete event.status;

    return (
      <Container>
        <Typography variant="h3" gutterBottom mb={3}>
          Create a New Event
        </Typography>

        <EventForm defaultValues={transformEvent(event)} action="create" />
      </Container>
    );
  } catch (error) {
    redirect("/404");
  }
}
