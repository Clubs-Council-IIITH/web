// next
import { useRouter } from "next/router";

// @mui
import { Box, Tab, Card, Grid, Divider, Container, Typography } from "@mui/material";

// components
import Page from "components/Page";
import Image from "components/Image";
import { EventDetails, EventPoster } from "components/events";

// import events from "_mock/events";
import { useQuery } from "@apollo/client";
import { GET_EVENT } from "gql/queries/events";
import { GET_CLUB } from "gql/queries/clubs";
import { useEffect } from "react";

export default function Event() {
    const { query } = useRouter();
    const { id } = query;

    useEffect(() => console.log("id", id), [id]);

    // get event data
    const {
        loading: eventLoading,
        error: eventError,
        data: { event } = {},
    } = useQuery(GET_EVENT, {
        skip: !id,
        variables: {
            eventid: id,
        },
    });

    // get club
    const {
        loading: clubLoading,
        error: clubError,
        data: { club } = {},
    } = useQuery(GET_CLUB, {
        skip: !event?.clubid,
        variables: {
            clubInput: { cid: event?.clubid },
        },
    });

    // TODO: handle event loading and error
    return eventLoading ? null : !event ? null : (
        <Page title={event?.name}>
            <Container>
                <Card>
                    <Grid container>
                        <Grid item xs={12} md={6} lg={6}>
                            <Card sx={{ m: 1 }}>
                                <Image src={event?.poster} ratio="1/1" alt={event?.name} />
                                <EventPoster event={event} club={club} />
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <EventDetails club={club} {...event} />
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </Page>
    );
}
