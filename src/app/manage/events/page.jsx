import Link from "next/link";

import { getClient } from "gql/client";
import { GET_ALL_EVENTS, GET_PENDING_EVENTS } from "gql/queries/events";

import { Box, Container, Typography, Button, Stack } from "@mui/material";

import Icon from "components/Icon";
import EventsTable from "components/events/EventsTable";

export const metadata = {
  title: "Manage Events",
};

export default async function ManageEvents() {
  const { data: { pendingEvents } = {} } = await getClient().query({
    query: GET_PENDING_EVENTS,
    variables: { clubid: null },
  });

  const { data: { events } = {} } = await getClient().query({
    query: GET_ALL_EVENTS,
    variables: { clubid: null },
  });

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h3" gutterBottom>
          Manage Events
        </Typography>

        <Button
          component={Link}
          href="/manage/events/new"
          variant="contained"
          startIcon={<Icon variant="add" />}
        >
          New Event
        </Button>
      </Stack>

      {/* only pending events */}
      <Box mb={3}>
        <Typography
          color="text.secondary"
          variant="subtitle2"
          textTransform="uppercase"
          gutterBottom
        >
          Pending Events
        </Typography>
        <EventsTable events={pendingEvents} scheduleSort="asc" />
      </Box>

      {/* all events */}
      <Box>
        <Typography
          color="text.secondary"
          variant="subtitle2"
          textTransform="uppercase"
          gutterBottom
        >
          All Events
        </Typography>
        <EventsTable events={events} scheduleSort="desc" />
      </Box>
    </Container>
  );
}
