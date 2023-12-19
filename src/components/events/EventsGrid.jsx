import { getClient } from "gql/client";
import { constructEventsQuery } from "gql/queries/events";
import { GET_CLUB } from "gql/queries/clubs";

import { Grid, Typography } from "@mui/material";
import EventCard from "components/events/EventCard";

export default async function EventsGrid({
  type = "all", // must be one of: {recent, club, all}, by default it should fetch all the events
  clubid = null,
  paginationOn = false,
  limit = undefined,
  skip = 0,
  filter = () => true,
}) {
  if (paginationOn && limit === undefined) {
    limit = 20;
  }
  const client = getClient();
  const data = await client.query(...constructEventsQuery({ type, clubid, paginationOn, skip, limit }));

  return (
    <Grid container spacing={2}>
      {extractEvents({ type, data })
        ?.filter(filter).length ? extractEvents({ type, data })
          ?.slice(0, limit)
          ?.filter(filter)
          ?.map(async (event) => {
            let { data: { club } = {} } = await getClient().query(GET_CLUB, {
              clubInput: { cid: event.clubid },
            });

            return (
              <Grid key={event._id} item xs={6} md={4} lg={3}>
                <EventCard
                  _id={event._id}
                  name={event.name}
                  datetimeperiod={event.datetimeperiod}
                  poster={event.poster ? event.poster : club.banner}
                />
              </Grid>
            )
          }) :
        <Typography variant="h4" color="text.secondary" sx={{ flexGrow: 1, textAlign: "center", mt: 5 }}>
          No events found.
        </Typography>
      }
    </Grid>
  );
}

// construct graphql query based on type
function constructQuery({ type, clubid, paginationOn, skip, limit }) {
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
        pagination: paginationOn,
        skip: skip,
        limit: limit,
      },
    ];
  } else if (type === "all") {
    return [
      GET_ALL_EVENTS,
      {
        clubid: null,
        pagination: paginationOn,
        skip: skip,
        limit: limit,
      },
    ];
  }
}

function extractEvents({ type, data }) {
  if (type === "recent") {
    return data?.data?.recentEvents;
  } else if (type === "club" || type === "all") {
    return data?.data?.events?.filter((event) =>
      ["approved", "completed"].includes(event?.status?.state)
    );
  } else {
    return [];
  }
}
