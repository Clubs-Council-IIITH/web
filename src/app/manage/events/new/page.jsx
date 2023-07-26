import { Container, Typography } from "@mui/material";

import EventForm from "components/events/EventForm";

export const metadata = {
  title: "New Event",
};

export default function NewEvent() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Create a New Event
      </Typography>

      <EventForm defaultValues={{}} action="create" />
    </Container>
  );
}
