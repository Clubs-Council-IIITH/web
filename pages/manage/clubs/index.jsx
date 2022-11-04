import Link from "next/link";

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

import { sentenceCase } from "change-case";

import Page from "components/Page";
import Image from "components/Image";
import Label from "components/label";
import Kebab from "components/Kebab";
import Table from "components/Table";
import Iconify from "components/iconify";

import clubs from "_mock/clubs";

export default function Clubs() {
    return (
        <Page title="Manage Clubs">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h3" gutterBottom>
                        Manage Clubs
                    </Typography>

                    <Button
                        component={Link}
                        href="#"
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New Club
                    </Button>
                </Stack>

                <Card>
                    <Box m={1}>
                        <Table data={clubs} header={ClubsTableHeader} row={ClubsTableRow} />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

function ClubsTableHeader() {
    return (
        <TableRow>
            <TableCell align="left">Club</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Category</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell padding="checkbox" />
        </TableRow>
    );
}

function ClubsTableRow(club) {
    const { name, img, mail, category, state } = club;

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
                <Box display="flex" alignItems="center" sx={{ color: "error.main" }}>
                    <Iconify icon="eva:trash-outline" sx={{ mr: 1 }} />
                    Delete
                </Box>
            ),
            onClick: () => null,
        },
    ];

    return (
        <TableRow>
            <TableCell align="left" sx={{ display: "flex", alignItems: "center" }}>
                <Image
                    disabledEffect
                    alt={name}
                    src={img}
                    sx={{
                        borderRadius: 1.5,
                        width: 64,
                        height: 64,
                        mr: 2,
                    }}
                />
                <Typography variant="subtitle2" noWrap>
                    {name}
                </Typography>
            </TableCell>
            <TableCell align="left">{mail}</TableCell>
            <TableCell align="left">{sentenceCase(category)}</TableCell>
            <TableCell align="center">
                <Label color={state == "ACTIVE" ? "success" : "error"}>{state}</Label>
            </TableCell>
            <TableCell align="right">
                <Kebab items={menuItems} />
            </TableCell>
        </TableRow>
    );
}
