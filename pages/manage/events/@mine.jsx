import { useState, useEffect } from "react";
import Link from "next/link";

import {
    Box,
    Button,
    Card,
    Stack,
    Container,
    Typography,
    InputAdornment,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useProgressbar } from "contexts/ProgressbarContext";

import Page from "components/Page";
import Table from "components/Table";
import Iconify from "components/iconify";
import ClientOnly from "components/ClientOnly";

import { useAuth } from "contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS } from "gql/queries/events";

import { EventsTableHeader, EventsTableRow } from "components/events/EventsTable";

export default function Events() {
    const { user } = useAuth();

    // get events of current club
    const {
        loading,
        error,
        data: { events } = {},
    } = useQuery(GET_ALL_EVENTS, {
        skip: !user?.uid,
        variables: {
            clubid: user?.uid,
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

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

    return (
        <Page title="Manage Events">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h3" gutterBottom>
                        Manage Events
                    </Typography>

                    <Button
                        component={Link}
                        href="/manage/events/new"
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New Event
                    </Button>
                </Stack>

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
