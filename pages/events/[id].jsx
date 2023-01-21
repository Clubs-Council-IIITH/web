// next
import { useRouter } from "next/router";

// @mui
import { Box, Tab, Card, Grid, Divider, Container, Typography } from "@mui/material";

// components
import Page from "components/Page";
import Image from "components/Image";
import { EventDetails, EventPoster } from "components/events";

import events from "_mock/events";

export default function Event() {
    const { query } = useRouter();
    const { id } = query;

    const event = events.find((e) => e.id === id);

    return (
        <Page title={event?.name}>
            <Container>
                <Card>
                    <Grid container>
                        <Grid item xs={12} md={6} lg={6}>
                            <Card sx={{ m: 1 }}>
                                <Image src={event?.poster} ratio="1/1" alt={event?.name} />
                                <EventPoster {...event} />
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <EventDetails {...event} />
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Page>
    );
}
