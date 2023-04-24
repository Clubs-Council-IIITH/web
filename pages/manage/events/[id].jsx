import { useState } from "react";

import { useRouter } from "next/router";

import { Box, Card, Grid, Container, Typography, Chip } from "@mui/material";

import Page from "components/Page";
import Image from "components/Image";
import ActionPalette from "components/ActionPalette";

import {
    editAction,
    deleteAction,
    submitAction,
    approveAction,
} from "components/events/EventActions";
import { EventDetails, EventPoster, EventStatus, EventBudget } from "components/events";

import { useQuery } from "@apollo/client";
import { GET_FULL_EVENT } from "gql/queries/events";
import { GET_CLUB } from "gql/queries/clubs";

import ClientOnly from "components/ClientOnly";

export default function Event() {
    const { query } = useRouter();
    const { id } = query;

    // set title asynchronously
    const [title, setTitle] = useState("...");

    return (
        <Page title={title}>
            <Container>
                <ClientOnly>
                    <EventDisplay id={id} setTitle={setTitle} />
                </ClientOnly>
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
    } = useQuery(GET_FULL_EVENT, {
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

    return (
        <Box>
            {/* action palette */}
            {/* <EventActions actions={["edit", "delete", "submit", "approve"]} /> */}
            <ActionPalette actions={[editAction, deleteAction, submitAction, approveAction]} />

            {/* current status */}
            <Box mt={4}>
                <EventStatus status={event?.status} />
            </Box>

            {/* details */}
            <Card sx={{ mt: 2 }}>
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

            {/* POC */}
            {/* <Card sx={{ mt: 2, p: 2 }}>
                <Typography variant="overline"> Point of Contact </Typography>
                <Box></Box>
            </Card> */}

            {/* budget */}
            <Card sx={{ mt: 2, p: 2 }}>
                <Typography color="text.secondary" variant="subtitle2">
                    BUDGET
                </Typography>
                <EventBudget rows={event?.budget} editable={false} />
            </Card>

            {/* venue */}
            <Card sx={{ mt: 2, p: 2 }}>
                <Typography color="text.secondary" variant="subtitle2">
                    VENUE
                </Typography>
                <Box mt={2}>
                    {event?.location?.map((venue, key) => (
                        <Chip key={key} label={venue} sx={{ mr: 1, p: 1 }} />
                    ))}
                </Box>

                <Box mt={2}>
                    <Typography variant="overline">Population</Typography>
                    <Typography variant="body2">{event?.population || 0}</Typography>
                </Box>

                <Box mt={2}>
                    <Typography variant="overline">Equipment</Typography>
                    <Typography variant="body2">{event?.equipment || "None"}</Typography>
                </Box>

                <Box mt={2}>
                    <Typography variant="overline">Additional Information</Typography>
                    <Typography variant="body2">{event?.additional || "None"}</Typography>
                </Box>
            </Card>
        </Box>
    );
}
