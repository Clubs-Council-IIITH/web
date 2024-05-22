import dynamic from "next/dynamic";
import Link from "next/link";

import { Box, Card, CardActionArea, Typography, Stack } from "@mui/material";

import EventPoster from "components/events/EventPoster";
import EventFallbackPoster from "components/events/EventFallbackPoster";
import {appendWeekday} from "utils/formatTime"

export default function EventCard({
  _id,
  name,
  startTime,
  endTime,
  poster,
  clubid,
}) {
  return (
    <Card>
      <CardActionArea component={Link} href={`/events/${_id}`}>
        <Box sx={{ pt: "100%", position: "relative" }}>
          {poster ? (
            <EventPoster name={name} poster={poster} width={600} height={600} />
          ) : (
            <EventFallbackPoster clubid={clubid} width={200} height={300} />
          )}
        </Box>

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontSize={16} noWrap>
            {name}
          </Typography>
          <Typography variant="caption" noWrap>
	    {appendWeekday(startTime)}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
