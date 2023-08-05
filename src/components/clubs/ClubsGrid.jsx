import { getClient } from "gql/client";
import { GET_ACTIVE_CLUBS } from "gql/queries/clubs";

import { Grid } from "@mui/material";
import ClubCard from "components/clubs/ClubCard";

export default async function ClubsGrid({ category, staticClubs = [] }) {
  const { data: { activeClubs } = {} } = await getClient().query(
    GET_ACTIVE_CLUBS,
    {}
  );

  return (
    <Grid container spacing={2}>
      {[...staticClubs, ...activeClubs]
        ?.filter((club) => club.category === category)
        ?.sort((a, b) => a.name.localeCompare(b.name))
        ?.map((club) => (
          <Grid key={club._id} item xs={12} md={6} lg={4} xl={3}>
            <ClubCard
              dim
              cid={club.cid}
              name={club.name}
              logo={club.logo}
              banner={club.banner}
              tagline={club.tagline}
              studentBody={club.studentBody}
            />
          </Grid>
        ))}
    </Grid>
  );
}
