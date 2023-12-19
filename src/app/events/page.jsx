import { getClient } from "gql/client";
import { GET_ALL_CLUBS } from "gql/queries/clubs";

import { Box } from "@mui/material";
import EventsFilter from "components/events/EventsFilter";
import EventsGrid from "components/events/EventsPageGrid";

export const metadata = {
  title: "Events",
};

const client = getClient();

async function query(queryString) {
  "use server";

  return client.query(...queryString);
}

export default async function Events({ searchParams }) {
  const targetName = searchParams?.name;
  const targetClub = searchParams?.club;
  const targetState = [
    ...(searchParams?.upcoming === "true" ? ["upcoming"] : []),
    ...(searchParams?.completed === "true" ? ["completed"] : []),
  ];

  let paginationOn = true;

  const { data: { allClubs } = {} } = await getClient().query(
    GET_ALL_CLUBS
  );

  return (
    <Box>
      <Box mt={2} mb={3}>
        <EventsFilter name={targetName} club={targetClub} state={targetState} />
      </Box>
      <EventsGrid
        query={query}
        paginationOn={paginationOn}
        limit={paginationOn ? 30 : undefined}
        allclubs={allClubs}
        targets = {[targetName, targetClub, targetState]}
      />
    </Box>
  );
}
