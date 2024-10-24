import { getClient } from "gql/client";
import { GET_ALL_PUBLIC_EVENTS } from "gql/queries/events";

import { Grid, Typography } from "@mui/material";
import EventCard from "components/events/EventCard";

export default async function EventsGrid({
  type = "all", // must be one of: {recent, club, all}
  clubid = null,
  limit = undefined,
  filter = () => true,
  events = null,
}) {
  let data;
  if (events) {
    data = { data: { events } };
  } else {
    data = await getClient().query(...constructQuery({ type, clubid, limit }));
  }

  return (
    <Grid container spacing={2}>
      {data?.data?.events?.filter(filter).length ? (
        data?.data?.events
          ?.slice(0, limit)
          ?.filter(filter)
          ?.map((event) => (
            <Grid key={event._id} item xs={6} md={4} lg={3}>
              <EventCard
                _id={event._id}
                name={event.name}
                datetimeperiod={event.datetimeperiod}
                poster={event.poster}
                clubid={event.clubid}
              />
            </Grid>
          ))
      ) : (
        <Typography
          variant="h4"
          color="text.secondary"
          sx={{ flexGrow: 1, textAlign: "center", mt: 5 }}
        >
          No events found.
        </Typography>
      )}
    </Grid>
  );
}

// construct graphql query based on type
function constructQuery({ type, clubid, limit }) {
  if (type === "recent") {
    return [
      GET_ALL_PUBLIC_EVENTS,
      {
        clubid: null,
        limit: limit || 12,
      },
    ];
  } else if (type === "club") {
    return [
      GET_ALL_PUBLIC_EVENTS,
      {
        clubid,
      },
    ];
  } else if (type === "all") {
    return [GET_ALL_PUBLIC_EVENTS];
  } else {
    throw new Error("Invalid event type");
  }
}
