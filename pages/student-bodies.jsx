import { Grid, Container, Stack, Typography } from "@mui/material";

import Page from "components/Page";
import ClientOnly from "components/ClientOnly";
import { ClubCard } from "components/clubs";

import { useQuery } from "@apollo/client";
import { GET_ACTIVE_CLUBS } from "gql/queries/clubs";

export default function StudentBodies() {
    return (
        <Page title="Clubs">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h3" gutterBottom>
                        Student Bodies
                    </Typography>
                </Stack>

                <ClientOnly>
                    <StudentBodiesList />
                </ClientOnly>
            </Container>
        </Page>
    );
}

function StudentBodiesList() {
    const { loading, error, data: { activeClubs: clubs } = {} } = useQuery(GET_ACTIVE_CLUBS);

    // TODO: add loading screen and empty list handling
    return loading ? null : clubs.length == 0 ? null : (
        <Grid container spacing={3}>
            {clubs
                ?.filter((club) => club.category === "other")
                ?.map((club, index) => (
                    <ClubCard key={index} club={club} index={index} />
                ))}
        </Grid>
    );
}
