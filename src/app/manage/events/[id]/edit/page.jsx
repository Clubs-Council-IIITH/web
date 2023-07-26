import { getClient } from "gql/client";
import { GET_EVENT } from "gql/queries/events";

import { Container, Typography } from "@mui/material";

import EventForm from "components/events/EventForm";

export const metadata = {
  title: "Edit Event",
};

function transformEvent(event) {
  return {
    ...event,
    // parse datetime strings to date objects
    datetimeperiod: [
      new Date(event?.datetimeperiod[0]),
      new Date(event?.datetimeperiod[1]),
    ],
    // add mandatory ID field for DataGrid
    budget: event?.budget?.map((budget, key) => ({
      ...budget,
      id: budget?.id || key,
    })),
  };
}

export default async function EditEvent({ params }) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query({
    query: GET_EVENT,
    variables: {
      eventid: id,
    },
  });

  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Edit Event Details
      </Typography>

      <EventForm defaultValues={transformEvent(event)} action="log" />
    </Container>
  );
}
