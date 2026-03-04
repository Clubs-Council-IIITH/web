import { Grid } from "@mui/material";

import { getClient } from "gql/client";
import { GET_ACTIVE_CLUBS } from "gql/queries/clubs";

import ClubCard from "components/clubs/ClubCard";

export default async function ClubsGrid({ category, staticClubs = [] }) {
  const { data, error } = await getClient(false).query(
    GET_ACTIVE_CLUBS,
    {},
    {
      requestPolicy: 'cache-first',
      fetchOptions: {
        cache: 'force-cache',
        next: { revalidate: 3600 }
      }
    }
  );

  const allClubs = data?.allClubs || [];

  return (
    <Grid container spacing={2}>
      {[...staticClubs, ...allClubs]
        ?.filter((club) => club.category === category)
        ?.sort((a, b) => a.name.localeCompare(b.name))
        ?.map((club) => (
          <Grid
            key={club.cid}
            size={{
              xs: 12,
              md: 6,
              lg: 4,
              xl: 3,
            }}
          >
            <ClubCard
              dim
              cid={club.cid}
              name={club.name}
              logo={club.logo}
              banner={club?.bannerSquare || club?.banner}
              tagline={club.tagline}
              studentBody={category == "body"}
            />
          </Grid>
        ))}
    </Grid>
  );
}
