// next
import Link from "next/link";
import { useRouter } from "next/router";

import {
    Box,
    Button,
    Card,
    TableRow,
    TableCell,
    Stack,
    Container,
    Typography,
} from "@mui/material";

import Page from "components/Page";
import Label from "components/label";
import Kebab from "components/Kebab";
import Table from "components/Table";
import Iconify from "components/iconify";

import { fDateTime } from "utils/formatTime";

import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS } from "gql/queries/events";
import { GET_CLUB } from "gql/queries/clubs";

import ClientOnly from "components/ClientOnly";
// import events from "_mock/events";

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
    const {
        loading,
        error,
        data: { events } = {},
    } = useQuery(GET_ALL_EVENTS, { variables: { clubid: null } });

    return loading ? null : error ? null : (
        <Table data={events} header={EventsTableHeader} row={EventsTableRow} />
    );
}

function EventsTableHeader() {
    return (
        <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Club</TableCell>
            <TableCell align="left">Scheduled</TableCell>
            <TableCell align="center">Budget</TableCell>
            <TableCell align="center">Venue</TableCell>
            <TableCell align="center">Status</TableCell>
            {/* <TableCell padding="checkbox" /> */}
        </TableRow>
    );
}

function EventsTableRow(event) {
    const router = useRouter();
    const { name, datetimeperiod, status } = event;

    console.log(event);

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

    // const menuItems = [
    //     {
    //         name: (
    //             <Box display="flex" alignItems="center">
    //                 <Iconify icon="eva:edit-outline" sx={{ mr: 1 }} />
    //                 Edit
    //             </Box>
    //         ),
    //         onClick: () => null,
    //     },
    //     {
    //         name: (
    //             <Box display="flex" alignItems="center" sx={{ color: "success.main" }}>
    //                 <Iconify icon="eva:checkmark-outline" sx={{ mr: 1 }} />
    //                 Approve
    //             </Box>
    //         ),
    //         onClick: () => null,
    //     },
    //     {
    //         name: (
    //             <Box display="flex" alignItems="center" sx={{ color: "error.main" }}>
    //                 <Iconify icon="eva:trash-outline" sx={{ mr: 1 }} />
    //                 Delete
    //             </Box>
    //         ),
    //         onClick: () => null,
    //     },
    // ];

    return (
        <TableRow
            hover
            onClick={() => router.push(`/manage/events/${event._id}`)}
            sx={{ cursor: "pointer" }}
        >
            <TableCell align="left" sx={{ border: "none" }}>
                <Typography variant="subtitle2" noWrap>
                    {name}
                </Typography>
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                {club?.name}
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                {fDateTime(datetimeperiod?.[0], "dd MMM, p")}
            </TableCell>
            <TableCell align="center" sx={{ border: "none" }}>
                <Iconify
                    sx={{ color: status?.budget ? "success.main" : "error.main" }}
                    icon={status?.budget ? "eva:checkmark-outline" : "eva:close-outline"}
                />
            </TableCell>
            <TableCell align="center" sx={{ border: "none" }}>
                <Iconify
                    sx={{ color: status?.venue ? "success.main" : "error.main" }}
                    icon={status?.venue ? "eva:checkmark-outline" : "eva:close-outline"}
                />
            </TableCell>
            <TableCell align="center" sx={{ border: "none" }}>
                <Label>{status?.state}</Label>
            </TableCell>
            {/* <TableCell align="right" sx={{ border: "none" }} onClick={(e) => e.stopPropagation()}>
                <Kebab items={menuItems} />
            </TableCell> */}
        </TableRow>
    );
}
