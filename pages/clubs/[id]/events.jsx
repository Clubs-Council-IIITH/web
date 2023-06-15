import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
    Box,
    Container,
    Typography,
    Grid,
} from "@mui/material";

import useResponsive from "hooks/useResponsive";
import { useProgressbar } from "contexts/ProgressbarContext";

import Page from "components/Page";
import { EventCard } from "components/events";

import { useQuery } from "@apollo/client";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_CLUB_EVENTS } from "gql/queries/events";

export default function ClubEvents() {
    const {
        query: { id },
    } = useRouter();

    const { asPath } = useRouter();
    const isDesktop = useResponsive("up", "sm");

    // set title asynchronously
    const [title, setTitle] = useState("...");

    const {
        data: { club } = {},
        loadingClub,
        errorClub,
    } = useQuery(GET_CLUB, {
        skip: !id,
        variables: {
            clubInput: { cid: id },
        },
        onCompleted: ({ club }) => {
            setTitle(club?.name + " | Events");
        },
        onError: (error) => {
            if (error.message == "No Club Found")
                router.push(`/404`)
        },
    });

    const {
        loading,
        error,
        data: { events } = {},
    } = useQuery(GET_CLUB_EVENTS, {
        variables: {
            clubid: id,
            clubInput: { cid: id },
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return (
        <Page title={title}>
            <Container>
                <center>
                    {loadingClub ? null : (
                        <Typography variant="h2" sx={{ mb: 4 }}>
                            Events - <i>{club?.name}</i>
                        </Typography>
                    )}
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