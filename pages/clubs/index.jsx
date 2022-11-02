// @mui
import { Grid, Container, Stack, Typography } from "@mui/material";

import Page from "components/Page";
import { ClubCard } from "components/clubs";

import clubs from "_mock/clubs";

export default function Clubs() {
    return (
        <Page title="Clubs">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h3" gutterBottom>
                        Clubs
                    </Typography>
                </Stack>

                <Grid container spacing={3}>
                    {clubs
                        .filter((club) => club.category !== "other")
                        .map((club, index) => (
                            <ClubCard key={index} club={club} index={index} />
                        ))}
                </Grid>
            </Container>
        </Page>
    );
}
