import { useEffect } from "react";
import Link from "next/link";

import { Button, Stack, Container, Typography } from "@mui/material";

import Page from "components/Page";
import Iconify from "components/iconify";
import ClientOnly from "components/ClientOnly";

import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS } from "gql/queries/events";

import { EventsTable } from "components/events/EventsTable";
import { useProgressbar } from "contexts/ProgressbarContext";

export default function Events() {
  // TODO: Change this page to show pending events and all events separately
  // Also, showing the events based on the roles, etc if required
  const {
    loading,
    error,
    data: { events } = {},
  } = useQuery(GET_ALL_EVENTS, { variables: { clubid: null } });

  // track loading state
  const { trackProgress } = useProgressbar();
  useEffect(() => trackProgress(loading), [loading]);

  return (
    <Page title="Manage Events">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h3" gutterBottom>
            Manage Events
          </Typography>

          <Button
            component={Link}
            href="/manage/events/new"
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Event
          </Button>
        </Stack>

        <ClientOnly>
          <EventsTable events={events} />
        </ClientOnly>
      </Container>
    </Page>
  );
}
