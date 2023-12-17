"use client";

import { Grid, Typography } from "@mui/material";
import EventCard from "components/events/EventCard";

export default async function EventsGrid({
  events = [],
  filter = () => true,
}) {
  return (
    <Grid container spacing={2}>
      {events ? events.map((event) => (
            <Grid key={event._id} item xs={6} md={4} lg={3}>
              <EventCard
                _id={event._id}
                name={event.name}
                datetimeperiod={event.datetimeperiod}
                poster={event.poster || "random"} // TODO: remove random from here, it's a temporary fix
                clubid={event.clubid}
              />
            </Grid>
          )) :
          <Typography variant="h4" color="text.secondary" sx={{flexGrow: 1, textAlign: "center", mt: 5}}>
            No events found.
          </Typography>
      }
    </Grid>
  );
}
