//next
import { useRouter } from "next/router";

// @mui
import { Typography, Divider, Box, Card, Container } from "@mui/material";

import Page from "components/Page";
import { ClubHero } from "components/clubs";

import clubs from "_mock/clubs";

export default function Club() {
    const { query } = useRouter();
    const { id } = query;

    const club = clubs.find((c) => c.id === id);

    return (
        <Page title="Clubs">
            <Container>
                {club && (
                    <Card>
                        <ClubHero club={club} />
                        <Box sx={{ p: { xs: 3, md: 5 } }}>
                            <Typography variant="body">{club.description}</Typography>

                            <Box my={5}>
                                <Divider />
                                <Typography variant="h4" pt={3} pb={2}>
                                    Events
                                </Typography>
                            </Box>

                            <Box my={5}>
                                <Divider />
                                <Typography variant="h4" pt={3} pb={2}>
                                    Members
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                )}
            </Container>
        </Page>
    );
}
