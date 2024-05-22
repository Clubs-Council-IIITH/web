import { Container, Typography } from "@mui/material";

import EventForm from "components/events/EventForm";

export const metadata = {
  title: "New Event",
};

export default function NewEvent() {
  // default form values
  const defaultValues = {
    clubid: "",
    name: "",
    startTime: "",
    endTime: "",
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

  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Create a New Event
      </Typography>

      <EventForm defaultValues={defaultValues} action="create" />
    </Container>
  );
}
