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

import { useQuery } from "@apollo/client";
import { GET_CLUB } from "gql/queries/clubs";

import { fDateTime } from "utils/formatTime";

import Label from "components/label";
import Kebab from "components/Kebab";
import Iconify from "components/iconify";

export function EventsTableHeader() {
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

export function EventsTableRow(event) {
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