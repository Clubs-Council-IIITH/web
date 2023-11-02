import { getClient } from "gql/client";
import {
  GET_RECENT_EVENTS,
  GET_CLUB_EVENTS,
  GET_ALL_EVENTS,
  GET_ALL_EVENTS_PAGINATED,
  GET_CLUB_EVENTS_PAGINATED,
} from "gql/queries/events";

import { Grid, Typography } from "@mui/material";
import EventCard from "components/events/EventCard";
import { GET_CLUB } from "gql/queries/clubs";

export default async function EventsGrid({
  type = "all", // must be one of: {recent, club, all}, by default it should fetch all the events
  clubid = null,
  paginationOn = false,
  limit = 20,
  skip = 0,
  filter = () => true,
}) {
  const data = await getClient().query(...constructQuery({ type, clubid, paginationOn, skip, limit }));
  const events = extractEvents({ type, data, paginationOn });

  return (
    <Grid container spacing={2}>
      {events ? events.map((event) => (
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
function constructQuery({ type, clubid, paginationOn, skip, limit }) {
  console.log("Pagination is set to :", paginationOn ? "On" : "Off")
  if (type === "recent") {
    return [GET_RECENT_EVENTS];
  }
  else if (type === "club") {
    return paginationOn ? [
      GET_CLUB_EVENTS_PAGINATED,
      {
        clubid,
        clubInput: {
          cid: clubid,
        },
        skip: skip,
        limit: limit,
      },
    ] : [
      GET_CLUB_EVENTS,
      {
        clubid,
        clubInput: {
          cid: clubid,
        },
      },
    ];
  } else if (type === "all") {
    return paginationOn ? [
      GET_ALL_EVENTS_PAGINATED,
      {
        clubid: null,
        skip: skip,
        limit: limit,
      },
    ] : [
      GET_ALL_EVENTS,
      {
        clubid: null,
      },
    ];
  }
}

function extractEvents({ type, data, paginationOn }) {
  if (type === "recent") {
    return data?.data?.recentEvents;
  } else if (type === "club") {
    if(paginationOn) {
      return data?.data?.paginatedEvents?.filter((event) =>
        ["approved", "completed"].includes(event?.status?.state)
      );
    } else {
      return data?.data?.events?.filter((event) =>
        ["approved", "completed"].includes(event?.status?.state)
      );
    }
  } else if (type === "all") {
    if(paginationOn) {
      return data?.data?.paginatedEvents?.filter((event) =>
        ["approved", "completed"].includes(event?.status?.state)
      );
    } else {
      return data?.data?.events?.filter((event) =>
        ["approved", "completed"].includes(event?.status?.state)
      );
    }
  }
}
