import { useEffect } from "react";
import { Grid, Container, Stack, Typography } from "@mui/material";

import Page from "components/Page";
import ClientOnly from "components/ClientOnly";
import { ClubCard } from "components/clubs";

import { useQuery } from "@apollo/client";
import { GET_ACTIVE_CLUBS } from "gql/queries/clubs";
import { useProgressbar } from "contexts/ProgressbarContext";

export default function Clubs() {
  return (
    <Page title="Clubs">
      <Container>
        <Stack mb={5}>
          <Typography color="text.secondary" variant="subtitle2" pb={2}>
            TECHNICAL
          </Typography>

          <ClientOnly>
            <ClubsList type="technical" />
          </ClientOnly>
        </Stack>

        <Stack>
          <Typography color="text.secondary" variant="subtitle2" pb={2}>
            CULTURAL
          </Typography>

          <ClientOnly>
            <ClubsList type="cultural" />
          </ClientOnly>
        </Stack>
      </Container>
    </Page>
  );
}

// fetch and render clubs
function ClubsList({ type }) {
  const { loading, error, data: { activeClubs: clubs } = {} } = useQuery(GET_ACTIVE_CLUBS);

  // track loading state
  const { trackProgress } = useProgressbar();
  useEffect(() => trackProgress(loading), [loading]);

  return loading ? null : !clubs?.length ? null : (
    <Grid container spacing={3}>
      {clubs
        ?.filter((club) => club.studentBody == false)
        ?.filter((club) => club.category === type)
        ?.sort((a, b) => a.name.localeCompare(b.name))
        ?.map((club, index) => (
          <ClubCard key={index} club={club} index={index} />
        ))}
    </Grid>
  );
}
