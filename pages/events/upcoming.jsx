import { useEffect } from "react";

import {
    Box,
    Container,
    Typography,
    Grid,
} from "@mui/material";

import { useProgressbar } from "contexts/ProgressbarContext";
import Page from "components/Page";
import { EventCard } from "components/events";

import { useQuery } from "@apollo/client";
import { GET_RECENT_EVENTS } from "gql/queries/events";

export default function ClubEvents() {
    // get recent events
    const { loading, error, data: { recentEvents: events } = {} } = useQuery(GET_RECENT_EVENTS);

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return (
        <Page title="Upcoming/Recent Events">
            <Container>
                <center>
                    <Typography variant="h2" sx={{ mb: 4 }}>
                        Upcoming/Recent Events
                    </Typography>
                </center>

                {loading ? null : !events?.length ? null :
                    (<Box sx={{ p: { xs: 2, md: 3 } }}>
                        <Grid container spacing={3}>
                            {events
                                ?.map((event) => (
                                    <Grid key={event.id} item xs={12} sm={6} md={4} lg={3}>
                                        <EventCard event={event} />
                                    </Grid>
                                ))}
                        </Grid>
                    </Box>)}
            </Container>
        </Page>
    );
}