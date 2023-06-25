import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
    Box,
    FormControl,
    Grid,
    Container,
    Select,
    MenuItem,
    InputLabel,
    InputAdornment,
    OutlinedInput,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useProgressbar } from "contexts/ProgressbarContext";

import Page from "components/Page";
import { EventCard } from "components/events";
import ClientOnly from "components/ClientOnly";

import { useQuery } from "@apollo/client";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";
import { GET_ALL_EVENTS } from "gql/queries/events";

export default function Events() {
    const router = useRouter();

    // Get all Events
    const {
        loading,
        error,
        data: { events } = {},
    } = useQuery(GET_ALL_EVENTS, {
        variables: {
            clubid: null,
        },
        onCompleted: console.log,
    });

    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // get filters from query params
    const { club: clubFilter, state: stateFilter } = router.query;

    useEffect(() => {
        if (events) {
            var filteredRows = events;

            // filter by club
            if (clubFilter) {
                filteredRows = filteredRows.filter(
                    (event) => event?.clubid === clubFilter
                );
            }

            // filter by state
            if (stateFilter === "upcoming") {
                filteredRows = filteredRows.filter(
                    (event) => new Date(event?.datetimeperiod[1]) > new Date()
                );
            } else if (stateFilter === "completed") {
                filteredRows = filteredRows.filter(
                    (event) => new Date(event?.datetimeperiod[1]) <= new Date()
                );
            }

            // filter by search term
            if (searchTerm) {
                filteredRows = filteredRows.filter((event) =>
                    event?.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setFilteredEvents(filteredRows);
        }
    }, [events, searchTerm, clubFilter, stateFilter]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // populate club IDs if user is CC
    const { data: { allClubs: clubs } = {}, loading: clubsLoading } = useQuery(
        GET_ALL_CLUB_IDS,
        {}
    );

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return (
        <Page title="All Events">
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="search"
                            type="search"
                            label="Search by name"
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
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <FormControl sx={{ width: "100%" }}>
                            <InputLabel id="clubSelect">Filter by club</InputLabel>
                            <Select
                                id="clubSelect"
                                labelId="clubSelect"
                                input={<OutlinedInput label="Filter by club" />}
                                value={clubFilter || ""}
                                onChange={(e) =>
                                    router.replace({
                                        query: { ...router.query, club: e.target.value },
                                    })
                                }
                            >
                                {clubs
                                    ?.slice()
                                    ?.sort((a, b) => a.name.localeCompare(b.name))
                                    ?.map((club) => (
                                        <MenuItem key={club?.cid} value={club?.cid}>
                                            {club?.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs md>
                        <FormControl sx={{ width: "100%" }}>
                            <InputLabel id="stateSelect">State</InputLabel>
                            <Select
                                id="stateSelect"
                                labelId="stateSelect"
                                input={<OutlinedInput label="State" />}
                                defaultValue={stateFilter || "all"}
                                onChange={(e) =>
                                    router.replace({
                                        query: { ...router.query, state: e.target.value },
                                    })
                                }
                            >
                                <MenuItem value={"all"}>All</MenuItem>
                                <MenuItem value={"upcoming"}>Upcoming</MenuItem>
                                <MenuItem value={"completed"}>Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box pt={2}>
                    <ClientOnly>
                        {loading ? null : !events?.length ? null : (
                            <EventsGrid data={filteredEvents} />
                        )}
                    </ClientOnly>
                </Box>
            </Container>
        </Page>
    );
}

function EventsGrid({ data }) {
    return (
        <Grid container spacing={2}>
            {/* display only 3/4 events on the main page */}
            {data?.map((event, key) => (
                <Grid key={key} item xs={6} sm={4} md={3}>
                    <EventCard event={event} />
                </Grid>
            ))}
        </Grid>
    );
}
