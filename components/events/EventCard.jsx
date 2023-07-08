import { useRouter } from "next/router";
import PropTypes from "prop-types";

import useResponsive from "hooks/useResponsive";

import { Box, Card, CardActionArea, Typography, Stack } from "@mui/material";

import Label from "components/label";
import EventPoster from "./EventPoster";
import { ISOtoHuman, fDateTime } from "utils/formatTime";

EventCard.propTypes = {
  event: PropTypes.object,
};

export default function EventCard({ event, state_label = false }) {
  const { _id, name, datetimeperiod } = event;
  const isDesktop = useResponsive("up", "sm");
  const router = useRouter();

  return (
    <Card>
      <CardActionArea onClick={() => router.push(`/events/${_id}`)}>
        <Box sx={{ pt: "100%", position: "relative" }}>
          {state_label && event?.status?.state && (
            <Label
              variant="filled"
              color={(event?.status?.state === "deleted" && "error") || "info"}
              sx={{
                zIndex: 9,
                top: 16,
                right: 16,
                position: "absolute",
                textTransform: "uppercase",
              }}
            >
              {event?.status?.state}
            </Label>
          )}
          <EventPoster event={event} />
        </Box>

        <Stack spacing={1} sx={{ p: isDesktop ? 3 : 2 }}>
          <Typography variant="subtitle2" fontSize={16} noWrap>
            {name}
          </Typography>
          <Typography variant="caption" noWrap>
            {ISOtoHuman(datetimeperiod?.[0], true)}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
