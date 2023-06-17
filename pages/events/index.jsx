import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Box, Card, Container, InputAdornment, TextField, TableRow, TableCell, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
        }
    });

    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const filteredRows = events?.filter((event) =>
            event?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filteredRows);
    }, [searchTerm, events]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

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

                <TextField
                    id="search"
                    type="search"
                    label="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                    disabled={loading}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <Card>
                    <Box m={1}>
                        <ClientOnly>
                            {loading ? null : !events?.length ? null : (
                                <Table
                                    data={filteredEvents}
                                    header={EventsTableHeader}
                                    row={EventsTableRow}
                                    noDataMessage="No Search Results Found!"
                                />
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
    const { name, datetimeperiod } = event;

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
            <TableCell
                align="left"
                sx={{ border: "none" }}
                style={{ maxWidth: 450 }}
            >
                <Typography variant="subtitle2" noWrap>
                    {name}
                </Typography>
            </TableCell>
            <TableCell
                align="left"
                sx={{ border: "none" }}
                style={{ maxWidth: 250 }}
            >
                { clubLoading ? null : clubError ? null :
                    <ClubBanner {...club} border={false} onclick={false} />
                }
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
