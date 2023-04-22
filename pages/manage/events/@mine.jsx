import Link from "next/link";

import { Box, Button, Card, Stack, Container, Typography } from "@mui/material";

import Page from "components/Page";
import Table from "components/Table";
import Iconify from "components/iconify";
import ClientOnly from "components/ClientOnly";

import { useAuth } from "contexts/AuthContext";
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
                        href="#"
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

    // TODO: handle loading and empty indicators
    return loading ? null : !events?.length ? null : (
        <Table data={events} header={EventsTableHeader} row={EventsTableRow} />
    );
}
