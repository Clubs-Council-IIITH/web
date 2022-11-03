//next
import { useRouter } from "next/router";

// @mui
import { Typography, Button, Box, Grid, Card, Container } from "@mui/material";

// hooks
import useResponsive from "hooks/useResponsive";

import Page from "components/Page";
import { ClubHero } from "components/clubs";
import { EventCard } from "components/events";
import Iconify from "components/iconify";

import clubs from "_mock/clubs";
import events from "_mock/events";

export default function Club() {
    const { query } = useRouter();
    const { id } = query;

    const isDesktop = useResponsive("up", "sm");

    const club = clubs.find((c) => c.id === id);

    return (
        <Page title="Clubs">
            <Container>
                {club && (
                    <>
                        <Card sx={{ mb: 4 }}>
                            <ClubHero club={club} />
                            <Box sx={{ p: { xs: 3, md: 5 } }}>
                                <Typography variant="body">{club.description}</Typography>
                            </Box>
                        </Card>

                        <Box sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography variant="h4">Events</Typography>
                            <Grid container spacing={3} mt={1}>
                                {/* display only 8 (or 4 on mobile) events on the main page */}
                                {events.slice(0, isDesktop ? 8 : 4).map((event) => (
                                    <Grid key={event.id} item xs={12} sm={6} md={3}>
                                        <EventCard event={event} />
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{ py: 2, textAlign: "right" }}>
                                <Button
                                    size="small"
                                    color="inherit"
                                    sx={{ p: 2 }}
                                    endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
                                >
                                    View all
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ p: { xs: 2, md: 3 } }}>
                            <Typography variant="h4">Members</Typography>
                        </Box>
                    </>
                )}
            </Container>
        </Page>
    );
}
