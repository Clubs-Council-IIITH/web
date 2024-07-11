import { Container, Typography } from "@mui/material";

import EventForm from "components/events/EventForm";

import { getClient } from "gql/client";
import { GET_ALL_EVENTS } from "gql/queries/events";

export const metadata = {
  title: "New Event",
};

export default async function NewEvent() {
  // default form values
  const defaultValues = {
    clubid: "",
    name: "",
    datetimeperiod: [null, null],
    description: "",
    audience: [],
    poster: "",
    budget: [],
    mode: "online",
    link: "",
    location: [],
    population: 0,
    additional: "",
    equipment: "",
    poc: "",
  };

  const { data: { events } = {} } = await getClient().query(GET_ALL_EVENTS, {
    clubid: null,
    public: false,
  });

  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Create a New Event
      </Typography>

      <EventForm
        defaultValues={defaultValues}
        existingEvents={events}
        action="create"
      />
    </Container>
  );
}
