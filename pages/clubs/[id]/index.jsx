import { useState, useEffect } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { Typography, Button, Box, Grid, Card, Container } from "@mui/material";

import useResponsive from "hooks/useResponsive";
import { useProgressbar } from "contexts/ProgressbarContext";

import Page from "components/Page";
import ClientOnly from "components/ClientOnly";
import { ClubHero, ClubSocial } from "components/clubs";
import { EventCard } from "components/events";
import { UserCard } from "components/users";
import { RichTextEditor } from "components/RichTextEditor";
import Iconify from "components/iconify";

import { useQuery } from "@apollo/client";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_MEMBERS } from "gql/queries/members";
import { GET_CLUB_EVENTS } from "gql/queries/events";

export default function Club() {
    const {
        query: { id },
    } = useRouter();

    // set title asynchronously
    const [title, setTitle] = useState("...");

    return (
        <Page title={title}>
            <Container>
                <ClientOnly>
                    <ClubDetails cid={id} setTitle={setTitle} />
                </ClientOnly>

                <ClientOnly>
                    <ClubEvents cid={id} />
                </ClientOnly>

                <ClientOnly>
                    <ClubMembers cid={id} />
                </ClientOnly>
            </Container>
        </Page>
    );
}

function ClubDetails({ cid, setTitle }) {
    const router = useRouter();

    const {
        data: { club } = {},
        loading,
        error,
    } = useQuery(GET_CLUB, {
        skip: !cid,
        variables: {
            clubInput: { cid: cid },
        },
        onCompleted: ({ club }) => {
            setTitle(club?.name);
        },
        onError: (error) => {
            if (error.message == "No Club Found")
                router.push(`/404`)
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return loading ? null : !club ? null : (
        <>
            <Card sx={{ mb: 2 }}>
                <ClubHero club={club} />
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                    <RichTextEditor
                        editing={false}
                        editorState={[JSON.parse(club.description), null]}
                    />
                </Box>
            </Card>
            <Box mb={2}>
                <ClubSocial socials={club?.socials} />
            </Box>
        </>
    );
}

function ClubEvents({ cid }) {
    const { asPath } = useRouter();
    const isDesktop = useResponsive("up", "sm");

    // API call to fetch events
    const {
        loading,
        error,
        data: { events } = {},
    } = useQuery(GET_CLUB_EVENTS, {
        variables: {
            clubid: cid,
            clubInput: { cid: cid },
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return loading ? null : !events?.length ? null : (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h4" mb={2}>
                Events
            </Typography>
            <Grid container spacing={3}>
                {/* display only 8 (or 4 on mobile) events on the main page */}
                {events
                    ?.slice(0, isDesktop ? 8 : 4)
                    ?.map((event) => (
                        <Grid key={event.id} item xs={12} sm={6} md={4} lg={3}>
                            <EventCard event={event} />
                        </Grid>
                    ))}
            </Grid>
            {(!isDesktop && events?.length > 4) || events?.length > 8 ? (
                <Box sx={{ pt: 2, textAlign: "right" }}>
                    <Button
                        component={Link}
                        href={`${asPath}/events`}
                        size="large"
                        color="inherit"
                        sx={{ p: 2 }}
                        endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
                    >
                        View more
                    </Button>
                </Box>
            ) : null}
        </Box>
    );
}

function ClubMembers({ cid }) {
    const { asPath } = useRouter();

    const {
        loading,
        error,
        data: { members } = {},
    } = useQuery(GET_MEMBERS, {
        variables: {
            clubInput: {
                cid: cid,
            },
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return loading ? null : !members?.length ? null : (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h4" mb={2}>
                Members
            </Typography>
            <ClientOnly>
                <Grid container spacing={3}>
                    {/* display only current members */}
                    {members
                        .filter(
                            // check if user has any current roles
                            (user) =>
                                user.roles
                                    ?.filter((role) => !role?.deleted)
                                    ?.filter((role) => role?.approved)
                                    ?.map((role) => role.endYear)
                                    .some((year) => year === null)
                        )
                        .map((user) => (
                            <Grid key={user.uid} item xs={12} sm={6} md={4} lg={3}>
                                <UserCard user={user} />
                            </Grid>
                        ))}
                </Grid>
            </ClientOnly>
            {members
                .filter(member => !members
                    .filter(
                        // check if user has any current roles
                        (user) =>
                            user.roles
                                ?.filter((role) => !role?.deleted)
                                ?.filter((role) => role?.approved)
                                ?.map((role) => role.endYear)
                                .some((year) => year === null)
                    ).includes(member))
                ?.length > 0 ? (
                <Box sx={{ pt: 2, textAlign: "right" }}>
                    <Button
                        component={Link}
                        href={`${asPath}/members`}
                        size="large"
                        color="inherit"
                        sx={{ p: 2 }}
                        endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
                    >
                        View all
                    </Button>
                </Box>
            ) : null}
        </Box>
    );
}
