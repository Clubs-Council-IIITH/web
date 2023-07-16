import { getClient } from "gql/client";
import { GET_ACTIVE_CLUBS } from "gql/queries/clubs";

import { Grid } from "@mui/material";
import ClubCard from "components/clubs/ClubCard";

export const dynamic = "force-dynamic";

export default async function ClubsGrid({ category }) {
  const { data: { activeClubs } = {} } = await getClient().query({
    query: GET_ACTIVE_CLUBS,
  });

  console.log(activeClubs);

  return (
    <Grid container spacing={2}>
      {activeClubs
        ?.filter((club) => club.category === category)
        ?.sort((a, b) => a.name.localeCompare(b.name))
        ?.map((club) => (
          <Grid key={club._id} item xs={12} md={6} lg={4}>
            <ClubCard
              cid={club.cid}
              name={club.name}
              banner={club.banner}
              tagline={club.tagline}
              studentBody={club.studentBody}
            />
          </Grid>
        ))}
    </Grid>
  );
}
