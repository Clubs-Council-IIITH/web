import Link from "next/link";

import { Box, Button, Card, Stack, Container, Typography } from "@mui/material";

import Page from "components/Page";
import Table from "components/Table";
import Iconify from "components/iconify";
import ClientOnly from "components/ClientOnly";

import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS } from "gql/queries/events";

import { EventsTableHeader, EventsTableRow } from "components/events/EventsTable";

export default function Events() {
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

                <Card>
                    <Box m={1}>
                        <ClientOnly>
                            <EventsTable />
                        </ClientOnly>
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

function EventsTable() {
    const {
        loading,
        error,
        data: { events } = {},
    } = useQuery(GET_ALL_EVENTS, { variables: { clubid: null } });

    return loading ? null : error ? null : (
        <Table data={events} header={EventsTableHeader} row={EventsTableRow} />
    );
}
