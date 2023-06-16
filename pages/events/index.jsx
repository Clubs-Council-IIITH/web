import { useEffect } from "react";
import { useRouter } from "next/router";

import { Box, Card, Container, TableRow, TableCell, Typography } from "@mui/material";

import { useProgressbar } from "contexts/ProgressbarContext";

import Page from "components/Page";
import Table from "components/Table";
import { ClubBanner } from "components/clubs";
import ClientOnly from "components/ClientOnly";

import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS } from "gql/queries/events";
import { GET_CLUB } from "gql/queries/clubs";

import { fDateTime } from "utils/formatTime";

export default function Events() {
    // Get all Events
    const { loading, error, data: { events } = {} } = useQuery(GET_ALL_EVENTS, {
        variables: {
            clubid: null,
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return (
        <Page title="All Events">
            <Container>
                <center>
                    <Typography variant="h2" sx={{ mb: 4 }}>
                        All Events
                    </Typography>
                </center>

                <Card>
                    <Box m={1}>
                        <ClientOnly>
                            {loading ? null : !events?.length ? null : (
                                <Table data={events} header={EventsTableHeader} row={EventsTableRow} />
                            )}
                        </ClientOnly>
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

function EventsTableHeader() {
    return (
        <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Club</TableCell>
            <TableCell align="left">Scheduled</TableCell>
        </TableRow>
    );
}

function EventsTableRow(event) {
    const router = useRouter();
    const { name, datetimeperiod, status } = event;

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
        <TableRow
            hover
            onClick={() => router.push(`/events/${event._id}`)}
            sx={{ cursor: "pointer" }}
        >
            <TableCell align="left" sx={{ border: "none" }}>
                <Typography variant="subtitle2" noWrap>
                    {name}
                </Typography>
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                <ClubBanner {...club} border={false} onclick={false} />
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                <Box display="flex" alignItems="center">
                    {fDateTime(datetimeperiod?.[0], "D MMM, H:mm")}
                    <Box mx={1}>-</Box>
                    {fDateTime(datetimeperiod?.[1], "D MMM, H:mm")}
                </Box>
            </TableCell>
        </TableRow >
    );
}
