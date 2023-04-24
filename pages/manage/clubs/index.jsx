import { useRouter } from "next/router";
import Link from "next/link";

import { useQuery } from "@apollo/client";
import { GET_ALL_CLUBS } from "gql/queries/clubs";

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

import { downloadFile } from "utils/files";
import ClientOnly from "components/ClientOnly";

export default function Clubs() {
    const { asPath } = useRouter();

    // handle loading and error
    return (
        <Page title="Manage Clubs">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h3" gutterBottom>
                        Manage Clubs
                    </Typography>

                    <Button
                        component={Link}
                        href={`${asPath}/new`}
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New Club
                    </Button>
                </Stack>

                <Card>
                    <Box m={1}>
                        <ClientOnly>
                            <ClubsTable />
                        </ClientOnly>
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

function ClubsTable() {
    const { loading, error, data: { allClubs: clubs } = {} } = useQuery(GET_ALL_CLUBS);

    return loading ? null : error ? null : (
        <Table data={clubs} header={ClubsTableHeader} row={ClubsTableRow} />
    );
}

function ClubsTableHeader() {
    return (
        <TableRow>
            <TableCell align="left">Club</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Category</TableCell>
            <TableCell align="center">Status</TableCell>
            {/* <TableCell padding="checkbox" /> */}
        </TableRow>
    );
}

function ClubsTableRow(club) {
    const router = useRouter();
    const { cid, name, logo, email, category, state } = club;

    // const menuItems = [
    //     {
    //         name: (
    //             <Box display="flex" alignItems="center">
    //                 <Iconify icon="eva:edit-outline" sx={{ mr: 1 }} />
    //                 Edit
    //             </Box>
    //         ),
    //         onClick: () => router.push(`${router.asPath}/${cid}/edit`),
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
            onClick={() => router.push(`/manage/clubs/${cid}`)}
            sx={{ cursor: "pointer" }}
        >
            <TableCell align="left" sx={{ display: "flex", alignItems: "center", border: "none" }}>
                <Image
                    disabledEffect
                    alt={name}
                    src={downloadFile(logo)}
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
            <TableCell align="left" sx={{ border: "none" }}>
                {email}
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                {sentenceCase(category)}
            </TableCell>
            <TableCell align="center" sx={{ border: "none" }}>
                <Label color={state === "active" ? "success" : "error"}>
                    {state?.toUpperCase()}
                </Label>
            </TableCell>
            {/* <TableCell align="right" sx={{ border: "none" }}>
                <Kebab items={menuItems} />
            </TableCell> */}
        </TableRow>
    );
}
