import { useState } from "react";
import { useRouter } from "next/router";

import { Box, Card, Grid, Container, Typography, Chip } from "@mui/material";

import Page from "components/Page";
import Image from "components/Image";
import ActionPalette from "components/ActionPalette";
import ClientOnly from "components/ClientOnly";

import {
    editAction,
    deleteAction,
    submitAction,
    approveAction,
} from "components/events/EventActions";
import { EventDetails, EventPoster, EventStatus, EventBudget } from "components/events";
import { locationLabel } from "utils/formatEvent";
import { useAuth } from "contexts/AuthContext";

import { useQuery } from "@apollo/client";
import { GET_FULL_EVENT } from "gql/queries/events";
import { GET_CLUB } from "gql/queries/clubs";
import { set } from "date-fns";

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
    const router = useRouter();
    const { user } = useAuth();
    const [actions, setActions] = useState([]);

    // TODO: set conditional actions based on event datetime, current status and user role
    // Rewrite below code to restructure as first check event status and then check user role
    // Club - past event - nothing (check based on event start time and current time)
    // Club - upcoming event - edit, delete
    // Club - incomplete event - edit, submit, delete
    // CC - past event - delete, edit (check based on event start time and current time)
    // CC - upcoming event - approve (check for approved or not), edit, delete
    // CC - incomplete event - edit
    // SLC/SLO - upcoming event - approve (check for approved or not)
    // else - nothing
    const setConditionalActions = (event) => {
        if (user?.role == "club" && event && event?.status?.state == "incomplete")
            setActions([editAction, submitAction, deleteAction]);
        else if (user?.role == "club" && event)
            setActions([editAction, deleteAction]);
        else if (user?.role == "cc") {
            if (event && event?.status?.state == "pending_cc")
                setActions([approveAction, editAction, deleteAction]);
            else
                setActions([editAction, deleteAction]);
        }
        else if (["slc", "slo"].includes(user?.role))
            setActions([approveAction,]);
    }

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
            setConditionalActions(event);
        },
        onError: (error) => {
            router.push(`/404`)
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
            {!actions.length ? null :
                <ActionPalette actions={actions} />
            }

            {/* current status */}
            <Box mt={3}>
                <EventStatus status={event?.status} location={event?.location} budget={event?.budget} />
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
                <Typography mb={2} color="text.secondary" variant="subtitle2">
                    BUDGET
                </Typography>
                {event?.budget?.length ?
                    <EventBudget
                        rows={event?.budget?.map((b, key) => ({ ...b, id: b?.id || key }))} // add ID to each budget item if it doesn't exist (MUI requirement)
                        editable={false}
                    />
                    : "Zero Budget Requested"}
            </Card>

            {/* venue */}
            <Card sx={{ mt: 2, p: 2 }}>
                <Typography color="text.secondary" variant="subtitle2">
                    VENUE
                </Typography>

                {/* show requested location details, if any */}
                {event?.location?.length ? (
                    <>
                        <Box mt={2}>
                            {event?.location?.map((venue, key) => (
                                <Chip
                                    key={key}
                                    label={locationLabel(venue)?.name}
                                    sx={{ mr: 1, p: 1 }}
                                />
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
                    </>
                ) : (
                    <Box mt={2}>None requested</Box>
                )}
            </Card>
        </Box>
    );
}
