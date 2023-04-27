import { useState } from "react";

import { useRouter } from "next/router";

import { Card, Grid, Container } from "@mui/material";

import Page from "components/Page";
import Image from "components/Image";
import { EventDetails, EventPoster } from "components/events";

import { useQuery } from "@apollo/client";
import { GET_EVENT } from "gql/queries/events";
import { GET_CLUB } from "gql/queries/clubs";

import ClientOnly from "components/ClientOnly";

export default function Event() {
    const { query } = useRouter();
    const { id } = query;

    // set title asynchronously
    const [title, setTitle] = useState("...");

    return (
        <Page title={title}>
            <Container maxWidth="xl">
                <Card>
                    <ClientOnly>
                        <EventDisplay id={id} setTitle={setTitle} />
                    </ClientOnly>
                </Card>
            </Container>
        </Page>
    );
}

function EventDisplay({ id, setTitle }) {
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
        onCompleted: ({ event }) => {
            setTitle(event?.name);
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
    );
}
