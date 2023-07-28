import { getClient } from "gql/client";
import {
  GET_RECENT_EVENTS,
  GET_CLUB_EVENTS,
  GET_ALL_EVENTS,
} from "gql/queries/events";

import { Grid } from "@mui/material";
import EventCard from "components/events/EventCard";

export default async function EventsGrid({
  type = "all", // must be one of: {recent, club, all}
  clubid = null,
  limit = undefined,
}) {
  const data = await getClient().query(...constructQuery({ type, clubid }));

  return (
    <Grid container spacing={2}>
      {extractEvents({ type, data })
        ?.slice(0, limit)
        ?.map((event) => (
          <Grid key={event._id} item xs={12} sm={6} md={4} lg={3}>
            <EventCard
              _id={event._id}
              name={event.name}
              datetimeperiod={event.datetimeperiod}
              poster={event.poster}
              clubid={event.clubid}
            />
          </Grid>
        ))}
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
      },
    ];
  } else if (type === "all") {
    return [
      GET_ALL_EVENTS,
      {
        clubid: null,
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