import Link from "next/link";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ALL_EVENTS, GET_PENDING_EVENTS } from "gql/queries/events";

import { Box, Container, Typography, Button, Stack } from "@mui/material";

import Icon from "components/Icon";
import EventsTable from "components/events/EventsTable";

export const metadata = {
  title: "Manage Events",
};

async function getalleventsquery(querystring) {
  "use server";

  const { data = {}, error } = await getClient().query(GET_ALL_EVENTS, {
    clubid: querystring["targetClub"],
    name: querystring["targetName"],
    public: false,
    pastEventsLimit: querystring["pastEventsLimit"],
  });

  if (error) {
    console.error(error);
    return [];
  }

  return data?.events || [];
}

export default async function ManageEvents() {
  const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
    userInput: null,
  });

  const { data: { pendingEvents } = {} } = await getClient().query(
    GET_PENDING_EVENTS,
    { clubid: userMeta?.role === "club" ? userMeta.uid : null },
  );

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

        {["cc", "club"].includes(userMeta?.role) ? (
          <Button
            component={Link}
            href="/manage/events/new"
            variant="contained"
            startIcon={<Icon variant="add" />}
          >
            New Event
          </Button>
        ) : null}
      </Stack>

      {/* only pending events */}
      {pendingEvents.length ? (
        <Box mb={3}>
          <Typography
            color="text.secondary"
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Pending Events
          </Typography>
          <EventsTable
            events={pendingEvents}
            scheduleSort="asc"
            hideClub={userMeta?.role === "club"} // hide club column if accessed by a club
          />
        </Box>
      ) : null}

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
        <EventsTable
          query={getalleventsquery}
          clubid={userMeta?.role === "club" ? userMeta.uid : null}
          scheduleSort="desc"
          hideClub={userMeta?.role === "club"} // hide club column if accessed by a club
        />
      </Box>
    </Container>
  );
}
