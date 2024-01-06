import { getClient } from "gql/client";
import {
  GET_RECENT_EVENTS,
  GET_CLUB_EVENTS,
  GET_ALL_EVENTS,
} from "gql/queries/events";

import { Grid, Typography } from "@mui/material";
import EventCard from "components/events/EventCard";

export default async function EventsGrid({
  type = "all", // must be one of: {recent, club, all}
  clubid = null,
  limit = undefined,
  filter = () => true,
}) {
  const data = await getClient().query(...constructQuery({ type, clubid }));

  return (
    <Grid container spacing={2}>
      {extractEvents({ type, data })
        ?.filter(filter).length ? extractEvents({ type, data })
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
          )) :
          <Typography variant="h4" color="text.secondary" sx={{flexGrow: 1, textAlign: "center", mt: 5}}>
            No events found.
          </Typography>
      }
    </Grid>
  );
}

// construct graphql query based on type
function constructQuery({ type, clubid }) {
  if (type === "recent") {
    return [GET_RECENT_EVENTS];
  } else if (type === "club") {
    return [
      GET_CLUB_EVENTS,
      {
        clubid,
        clubInput: {
          cid: clubid,
        },
        public: true,
      },
    ];
  } else if (type === "all") {
    return [
      GET_ALL_EVENTS,
      {
        clubid: null,
        public: true,
      },
    ];
  }
}

function extractEvents({ type, data }) {
  if (type === "recent") {
    return data?.data?.recentEvents;
  } else if (type === "club") {
    return data?.data?.events?.filter((event) =>
      ["approved", "completed"].includes(event?.status?.state)
    );
  } else if (type === "all") {
    return data?.data?.events?.filter((event) =>
      ["approved", "completed"].includes(event?.status?.state)
    );
  }
}
