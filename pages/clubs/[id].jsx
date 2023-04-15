import { useState } from "react";

// next
import { useRouter } from "next/router";
import Link from "next/link";

// @mui
import { Typography, Button, Box, Grid, Card, Container } from "@mui/material";

// hooks
import useResponsive from "hooks/useResponsive";

import Page from "components/Page";
import ClientOnly from "components/ClientOnly";
import { ClubHero } from "components/clubs";
import { EventCard } from "components/events";
import { UserCard } from "components/users";
import { RichTextEditor } from "components/RichTextEditor";
import Iconify from "components/iconify";

import { useQuery } from "@apollo/client";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_MEMBERS } from "gql/queries/members";
import { GET_CLUB_EVENTS } from "gql/queries/events";

// import events from "_mock/events";

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
    const {
        loading,
        error,
        data: { club } = {},
    } = useQuery(GET_CLUB, {
        variables: {
            clubInput: {
                cid: cid,
            },
        },
        onCompleted: ({ club }) => {
            setTitle(club?.name);
        },
    });

    // TODO: handle loading screen and non-existent club
    return loading ? null : !club ? null : (
        <Card sx={{ mb: 4 }}>
            <ClubHero club={club} />
            <Box sx={{ p: { xs: 3, md: 5 } }}>
                <RichTextEditor
                    editing={false}
                    editorState={[JSON.parse(club.description), null]}
                />
            </Box>
        </Card>
    );
}

function ClubEvents({ cid }) {
    const { asPath } = useRouter();
    const isDesktop = useResponsive("up", "sm");

    // API call to fetch events
    const {
        loading,
        error,
        data: { events, club } = {},
    } = useQuery(GET_CLUB_EVENTS, {
        variables: {
            clubid: cid,
            clubInput: { cid: cid },
        },
    });

    // TODO: handle loading screen and zero events
    return loading ? null : !events?.length ? null : (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h4">Events</Typography>
            <Grid container spacing={3} mt={1}>
                {/* display only 8 (or 4 on mobile) events on the main page */}
                {events?.slice(0, isDesktop ? 8 : 4).map((event) => (
                    <Grid key={event.id} item xs={12} sm={6} md={3}>
                        <EventCard event={event} club={club} />
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ py: 2, textAlign: "right" }}>
                <Button
                    component={Link}
                    href={`${asPath}/events`}
                    size="small"
                    color="inherit"
                    sx={{ p: 2 }}
                    endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
                >
                    View more
                </Button>
            </Box>
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

    return loading ? null : !members ? null : (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h4">Members</Typography>
            <Grid container spacing={3} mt={1}>
                {/* display only current members */}
                {members
                    .filter((user) => user.startYear === new Date().getFullYear())
                    .map((user) => (
                        <Grid key={user.uid} item xs={12} sm={6} md={3}>
                            <UserCard user={user} />
                        </Grid>
                    ))}
            </Grid>
            <Box sx={{ py: 2, textAlign: "right" }}>
                <Button
                    component={Link}
                    href={`${asPath}/members`}
                    size="small"
                    color="inherit"
                    sx={{ p: 2 }}
                    endIcon={<Iconify icon={"eva:arrow-ios-forward-fill"} />}
                >
                    View all
                </Button>
            </Box>
        </Box>
    );
}
