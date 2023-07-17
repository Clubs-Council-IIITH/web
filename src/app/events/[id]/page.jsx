import { getClient } from "gql/client";
import { GET_EVENT } from "gql/queries/events";

import { Divider, Card, Stack, Box, Grid, Typography } from "@mui/material";

import { ISOtoHuman } from "utils/formatTime";
import { locationLabel } from "utils/formatEvent";

import ClubButton from "components/clubs/ClubButton";
import EventPoster from "components/events/EventPoster";
import AudienceChips from "components/events/AudienceChips";
import EventFallbackPoster from "components/events/EventFallbackPoster";

import Icon from "components/Icon";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query({
    query: GET_EVENT,
    variables: {
      eventid: id,
    },
  });

  return {
    title: event.name,
  };
}

export default async function Event({ params }) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query({
    query: GET_EVENT,
    variables: {
      eventid: id,
    },
  });

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <Box sx={{ pt: "100%", position: "relative" }}>
              {event.poster ? (
                <EventPoster
                  name={event.name}
                  poster={event.poster}
                  width={200}
                  height={300}
                />
              ) : (
                <EventFallbackPoster
                  name={event.name}
                  clubid={event.clubid}
                  width={200}
                  height={300}
                />
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs md>
          <Stack direction="column" p={1}>
            <Box display="flex" alignItems="center">
              <Icon variant="calendar-today" sx={{ mr: 2, width: 16 }} />
              <Typography variant="body2">
                {ISOtoHuman(event.datetimeperiod?.[0])}
              </Typography>
              <Box mx={1}>-</Box>
              <Typography variant="body2">
                {ISOtoHuman(event.datetimeperiod?.[1])}
              </Typography>
            </Box>

            <Typography variant="h3" paragraph mt={1}>
              {event.name}
            </Typography>

            <ClubButton clubid={event.clubid} />

            <Box display="flex" mt={4} alignItems="center">
              <Icon variant="location-on-outline-rounded" sx={{ mr: 2 }} />
              <Typography variant="body1">
                {["offline", "hybrid"].includes(event.mode)
                  ? event.location.length > 0
                    ? event.location
                        .map((l) => locationLabel(l).name)
                        .join(", ")
                    : event.mode.charAt(0).toUpperCase() + event.mode.slice(1)
                  : "Online"}
              </Typography>
            </Box>

            <Box display="flex" mt={3} alignItems="center">
              <Icon variant="group-outline-rounded" sx={{ mr: 2 }} />
              <AudienceChips audience={event.audience} />
            </Box>

            <Divider sx={{ borderStyle: "dashed", my: 3 }} />

            <Typography variant="body" paragraph>
              {event.description}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
