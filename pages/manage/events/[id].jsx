// next
import { useRouter } from "next/router";

// @mui
import { Box, Tab, Card, Grid, Divider, Container, Typography } from "@mui/material";

// components
import Page from "components/Page";
import Image from "components/Image";
import { EventDetails, EventPoster, EventStatus, EventActions, EventBudget } from "components/events";

import events from "_mock/events";

export default function Event() {
    const { query } = useRouter();
    const { id } = query;

    const event = events.find((e) => e.id === id);

    return (
        <Page title={event?.name}>
            <Container>
                {/* current status */}
                <EventStatus state={event?.state} />

                {/* action palette */}
                <Card sx={{ mt: 2 }}>
                    <EventActions actions={["edit", "delete", "submit", "approve"]} />
                </Card>

                {/* details */}
                <Card sx={{ mt: 2 }}>
                    <Grid container>
                        <Grid item xs={12} md={6} lg={6}>
                            <Card sx={{ m: 1 }}>
                                <Image src={event?.poster} ratio="1/1" />
                                <EventPoster event={event} />
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <EventDetails event={event} />
                        </Grid>
                    </Grid>
                </Card>

                {/* finance */}
                <Card sx={{ mt: 2, p: 2 }}>
                    <Typography variant="overline"> Budget </Typography>
                    <EventBudget editable={true} />
                </Card>

                {/* venue */}
                <Card sx={{ mt: 2 }}>
                </Card>
            </Container>
        </Page >
    );
}
