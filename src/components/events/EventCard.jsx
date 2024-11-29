"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { Box, Card, CardActionArea, Typography, Stack } from "@mui/material";

import EventPoster from "components/events/EventPoster";

const DateTime = dynamic(() => import("components/DateTime"), { ssr: false });

export default function EventCard({
  _id,
  name,
  datetimeperiod,
  poster,
  blur = 0,
}) {
  return (
    <Card>
      <CardActionArea component={Link} href={`/events/${_id}`}>
        <Box sx={{ pt: "100%", position: "relative" }}>
          {poster ? (
            <EventPoster
              name={name}
              poster={poster}
              width={600}
              height={600}
              style={{
                filter: `blur(${blur}em)`,
              }}
            />
          ) : null}
        </Box>

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontSize={16} noWrap>
            {name}
          </Typography>
          <Typography variant="caption" noWrap>
            <DateTime dt={datetimeperiod?.[0]} showWeekDay={true} />
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
