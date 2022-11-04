import {
    Avatar,
    Box,
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

import members from "_mock/members";

export default function Members() {
    return (
        <Page title="Manage Members">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h3" gutterBottom>
                        Manage Members
                    </Typography>
                </Stack>

                <Card>
                    <Box m={1}>
                        <Table data={members} header={MembersTableHeader} row={MembersTableRow} />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

function MembersTableHeader() {
    return (
        <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Club</TableCell>
            <TableCell align="left">Scheduled</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell padding="checkbox" />
        </TableRow>
    );
}

function MembersTableRow(member) {
    const {
        user: { img, firstName, lastName, mail },
        role,
        year,
        approved,
    } = member;

    const menuItems = [
        {
            name: (
                <Box display="flex" alignItems="center">
                    <Iconify icon="eva:edit-outline" sx={{ mr: 1 }} />
                    Edit
                </Box>
            ),
            onClick: () => null,
        },
        {
            name: (
                <Box display="flex" alignItems="center" sx={{ color: "success.main" }}>
                    <Iconify icon="eva:checkmark-outline" sx={{ mr: 1 }} />
                    Approve
                </Box>
            ),
            onClick: () => null,
        },
        {
            name: (
                <Box display="flex" alignItems="center" sx={{ color: "error.main" }}>
                    <Iconify icon="eva:trash-outline" sx={{ mr: 1 }} />
                    Remove
                </Box>
            ),
            onClick: () => null,
        },
    ];

    return (
        <TableRow>
            <TableCell align="left" sx={{ display: "flex", alignItems: "center", border: "none" }}>
                <Avatar
                    src={img}
                    alt={`${firstName} ${lastName}`}
                    sx={{
                        width: 64,
                        height: 64,
                        mr: 2,
                    }}
                />
                <Typography variant="subtitle2" noWrap>
                    {`${firstName} ${lastName}`}
                </Typography>
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                {mail}
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                {role}
            </TableCell>
            <TableCell align="center" sx={{ border: "none" }}>
                <Label color={approved ? "success" : "warning"}>
                    {approved ? "APPROVED" : "PENDING"}
                </Label>
            </TableCell>
            <TableCell align="right" sx={{ border: "none" }}>
                <Kebab items={menuItems} />
            </TableCell>
        </TableRow>
    );
}
