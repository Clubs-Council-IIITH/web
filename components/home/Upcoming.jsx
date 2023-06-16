import { useEffect } from "react";
import Link from "next/link";

import { useQuery } from "@apollo/client";
import { GET_RECENT_EVENTS } from "gql/queries/events";

import { Typography, Box, Grid, Button } from "@mui/material";
import { useProgressbar } from "contexts/ProgressbarContext";
import useResponsive from "hooks/useResponsive";

import { EventCard } from "components/events";
import Iconify from "components/iconify";

export default function Upcoming() {
    // get recent events
    const { loading, error, data: { recentEvents: events } = {} } = useQuery(GET_RECENT_EVENTS);

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    const isDesktop = useResponsive("up", "md");
    const isMobile = useResponsive("down", "sm");

    return loading ? null : !events.length ? null : (
        <Box mt={4}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    Upcoming and Recent Events
                    <Button
                        component={Link}
                        href="/events/upcoming"
                        size="small"
                        color="inherit"
                        sx={{ p: 2 }}
                        endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
                    >
                        View more
                    </Button>
                </Box>
            </Typography>
            <Grid container spacing={2}>
                {/* display only 3/4 events on the main page */}
                {events
                    ?.slice(0, !isDesktop && !isMobile ? 3 : 4)
                    ?.map((event, key) => (
                    <Grid key={key} item xs={6} sm={4} md={3}>
                        <EventCard event={event} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
