import { useEffect } from "react";
import Link from "next/link";

import { useQuery } from "@apollo/client";
import { GET_RECENT_EVENTS } from "gql/queries/events";

import { Typography, Button, Box, Grid } from "@mui/material";
import { useProgressbar } from "contexts/ProgressbarContext";

import { EventCard } from "components/events";
import Iconify from "components/iconify";

export default function Upcoming() {
    // get recent events
    const { loading, error, data: { recentEvents: events } = {} } = useQuery(GET_RECENT_EVENTS);

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return loading ? null : !events.length ? null : (
        <Box mt={4}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    Upcoming and recent events
                    {/* <Button
                        component={Link}
                        href="/events"
                        size="small"
                        color="inherit"
                        sx={{ p: 2 }}
                        endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
                    >
                        View more
                    </Button> */}
                </Box>
            </Typography>
            <Grid container spacing={3}>
                {/* display only 4 events on the main page */}
                {events?.slice(0, 4)?.map((event, key) => (
                    <Grid key={key} item xs={12} sm={6} md={3}>
                        <EventCard event={event} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
