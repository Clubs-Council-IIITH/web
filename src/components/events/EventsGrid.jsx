import { getClient } from "gql/client";
import { GET_ALL_EVENTS } from "gql/queries/events";
import { GET_CLUB } from "gql/queries/clubs";

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

  const updatedEvents = await Promise.all(
    data?.data?.events?.map(async (event) => {
      if (!event.poster || event.poster == null) {
        const { data: { club } = {} } = await getClient().query(GET_CLUB, {
          clubInput: { cid: event?.clubid },
        });
        event.clubbanner = club?.banner || club?.logo;
      }
      return event;
    })
  );

  return (
    <Grid container spacing={2}>
      {updatedEvents?.filter(filter).length ? (
        updatedEvents
          ?.slice(0, limit)
          ?.filter(filter)
          ?.map((event) => (
            <Grid key={event._id} item xs={6} md={4} lg={3}>
              <EventCard
                _id={event._id}
                name={event.name}
                datetimeperiod={event.datetimeperiod}
                poster={event.poster || event.clubbanner}
                clubid={event.clubid}
                blur={event.poster ? 0 : 0.3}
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
      GET_ALL_EVENTS,
      {
        clubid: null,
        limit: limit || 12,
        public: true,
      },
    ];
  } else if (type === "club") {
    return [
      GET_ALL_EVENTS,
      {
        clubid,
        public: true,
      },
    ];
  } else {
    throw new Error("Invalid event type");
  }
}
