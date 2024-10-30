import { getClient } from "gql/client";
import { GET_ALL_EVENTS } from "gql/queries/events";
import { GET_CLUB } from "gql/queries/clubs";

import { Box } from "@mui/material";

import EventsFilter from "components/events/EventsFilter";
import PaginatedEventsGrid from "components/events/PaginatedEventGrid";

export const metadata = {
  title: "Events | Clubs Council @ IIIT-H",
};

const client = getClient();

async function query(querystring) {
  "use server";
  const { data = {}, error } = await client.query(GET_ALL_EVENTS, {
    clubid: querystring["targetClub"],
    name: querystring["targetName"],
    public: true,
    paginationOn: querystring["paginationOn"],
    skip: querystring["skip"],
    limit: querystring["limit"],
  });

  if (error) {
    console.error(error);
    return [];
  }

  return data?.events || [];
}

async function clubBannerQuery(clubid) {
  "use server";
  const { data: { club } = {} } = await client.query(GET_CLUB, {
    clubInput: { cid: clubid },
  });

  return club?.bannerSquare || club?.logo;
}

export default async function Events({ searchParams }) {
  const targetName = searchParams?.name;
  const targetClub = searchParams?.club;
  let targetState = [
    ...(searchParams?.upcoming === "true" ? ["upcoming"] : []),
    ...(searchParams?.completed === "true" ? ["completed"] : []),
  ];

  if (targetState.length === 0) targetState = ["upcoming", "completed"];

  return (
    <Box>
      <Box mt={2}>
        <EventsFilter name={targetName} club={targetClub} state={targetState} />
      </Box>
      <PaginatedEventsGrid
        query={query}
        clubBannerQuery={clubBannerQuery}
        targets={[targetName, targetClub, targetState]} // Pass updated targets here
      />
    </Box>
  );
}
