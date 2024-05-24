import dynamic from "next/dynamic";

import { Divider, Card, Stack, Box, Grid, Typography } from "@mui/material";

import { locationLabel } from "utils/formatEvent";
import { shortDateStr  } from "utils/formatTime";

import ClubButton from "components/clubs/ClubButton";
import EventPoster from "components/events/EventPoster";
import AudienceChips from "components/events/AudienceChips";
import EventFallbackPoster from "components/events/EventFallbackPoster";

import Icon from "components/Icon";

export default function EventDetails({ event, showCode = false }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <Box sx={{ pt: "100%", position: "relative" }}>
            {event.poster ? (
              <EventPoster
                name={event.name}
                poster={event.poster}
                width={2000}
                height={2000}
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
              {shortDateStr(event?.startTime)}
            </Typography>
            <Box mx={1}>-</Box>
            <Typography variant="body2">
              {shortDateStr(event?.endTime)} (IST)
            </Typography>
          </Box>

          <Typography variant="h3" paragraph mt={1} mb={0}>
            {event.name}
          </Typography>
          {showCode ? (
            <Typography
              color="text.disabled"
              variant="subtitle2"
              fontFamily="monospace"
              mt={0}
              mb={3}
            >
              #{event.code}
            </Typography>
          ) : null}

          <Box my={1} />

          <ClubButton clubid={event.clubid} />

          <Box display="flex" mt={4} alignItems="center">
            <Icon variant="location-on-outline-rounded" sx={{ mr: 2 }} />
            <Typography variant="body1">
              {["offline", "hybrid"].includes(event.mode)
                ? event.location.length > 0
                  ? event.location.map((l) => locationLabel(l).name).join(", ")
                  : event.mode.charAt(0).toUpperCase() + event.mode.slice(1)
                : "Online"}
            </Typography>
          </Box>

          <Box display="flex" mt={3} alignItems="center">
            <Icon variant="group-outline-rounded" sx={{ mr: 2 }} />
            <AudienceChips audience={event.audience} />
          </Box>

          <Divider sx={{ borderStyle: "dashed", my: 3 }} />

          <Typography variant="body" sx={{ whiteSpace: "pre-wrap" }}>
            {event.description || "No description available."}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}
