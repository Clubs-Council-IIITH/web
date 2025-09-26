import { getClient } from "gql/client";
import { GET_ALL_EVENTS } from "gql/queries/events";
import { GET_ALL_CLUBS } from "gql/queries/clubs";

import { Box } from "@mui/material";
import dayjs from "dayjs";

import EventsFilter from "components/events/EventsFilter";
import PaginatedEventsGrid from "components/events/PaginatedEventGrid";

export const metadata = {
  title: "Events | Life @ IIIT-H",
};

async function query(querystring) {
  "use server";
  
  let pastEventsLimit = 4;
  if (querystring["pastEventsLimit"] === "false") {
    pastEventsLimit = null;
  }

  const { data = {}, error } = await getClient().query(GET_ALL_EVENTS, {
    clubid: querystring["targetClub"],
    name: querystring["targetName"],
    public: true,
    paginationOn: querystring["paginationOn"],
    skip: querystring["skip"],
    limit: querystring["limit"],
    pastEventsLimit: pastEventsLimit,
  });

  if (error) {
    console.error(error);
    return [];
  }

  return data?.events || [];
}

export default async function Events({ searchParams }) {
  const targetName = searchParams?.name;
  const targetClub = searchParams?.club;

  let targetState = ["upcoming", "completed"];
  targetState = targetState.filter(
    (state) => searchParams?.[state] !== "false",
  );

  let filterMonth = ["pastEventsLimit"];
  let pastEventsLimit = searchParams?.pastEventsLimit;
  if (pastEventsLimit === "false") { filterMonth = []; }

  const { data: { allClubs } = {} } = await getClient().query(GET_ALL_CLUBS);

  return (
    <Box>
      <Box mt={2}>
        <EventsFilter
          name={targetName}
          club={targetClub}
          state={targetState}
          filterMonth={filterMonth}
        />
      </Box>
      <PaginatedEventsGrid
        query={query}
        clubs={allClubs}
        targets={[targetName, targetClub, targetState, pastEventsLimit]}
      />
    </Box>
  );
}
