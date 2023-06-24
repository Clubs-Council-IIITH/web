import { useRouter } from "next/router";

import { TableRow, TableCell, Typography } from "@mui/material";

import { useQuery } from "@apollo/client";
import { GET_CLUB } from "gql/queries/clubs";

import { fDateTime } from "utils/formatTime";

import Label from "components/label";
import Iconify from "components/iconify";
import { stateLabel } from "utils/formatEvent";

export function EventsTableHeader() {
    return (
        <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Club</TableCell>
            <TableCell align="left">Scheduled</TableCell>
            <TableCell align="center">Budget</TableCell>
            <TableCell align="center">Venue</TableCell>
            <TableCell align="center">Status</TableCell>
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
                {fDateTime(datetimeperiod?.[0], "D MMM, H:mm")}
            </TableCell>
            <TableCell align="center" sx={{ border: "none" }}>
                <Iconify
                    sx={{ color: status?.budget ? "success.main" : "error.main" }}
                    icon={status?.budget ? "eva:checkmark-outline" : "eva:close-outline"}
                />
            </TableCell>
            <TableCell align="center" sx={{ border: "none" }}>
                <Iconify
                    sx={{ color: status?.room ? "success.main" : "error.main" }}
                    icon={status?.room ? "eva:checkmark-outline" : "eva:close-outline"}
                />
            </TableCell>
            <TableCell align="center" sx={{ border: "none" }}>
                <Label color={stateLabel(status?.state)?.color}>
                    {stateLabel(status?.state)?.shortName}
                </Label>
            </TableCell>
        </TableRow>
    );
}
