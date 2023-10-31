import React from "react";
import { Container, Typography } from "@mui/material";
import BuzzSchedule from "components/buzz"; 
import { getStaticFile } from "utils/files";
import { getClient } from "gql/client";
import { GET_ALL_CLUBS } from "gql/queries/clubs";

export const metadata = {
  title: "Buzz Schedule",
};

export default async function Managebuzz() {
    const event = await fetch(getStaticFile('buzz.json'));
    const events = await event.json();
  const eventsWithIds = events.map((event, index) => ({
    ...event,
    id: index + 1
  }));

  const { data: { allClubs } = {} } = await getClient().query(
    GET_ALL_CLUBS
  );

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Felicity Buzz Schedule
      </Typography>
      <BuzzSchedule events={eventsWithIds} allClubs={allClubs}/>
    </Container>
  );
}
