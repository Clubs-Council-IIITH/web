// next
import Link from "next/link";

// @mui
import { Typography, Button, Box, Grid } from "@mui/material";

// components
import { EventCard } from "components/events";
import Iconify from "components/iconify";

import events from "_mock/events";

export default function Upcoming() {
    return (
        <Box mt={4}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    Upcoming Events
                    <Button
                        component={Link}
                        href="/events"
                        size="small"
                        color="inherit"
                        sx={{ p: 2 }}
                        endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
                    >
                        View more
                    </Button>
                </Box>
            </Typography>
            <Grid container spacing={3}>
                {/* display only 4 events on the main page */}
                {events.slice(0, 4).map((event) => (
                    <Grid key={event.id} item xs={12} sm={6} md={3}>
                        <EventCard event={event} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
