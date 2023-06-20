import { useState, useEffect } from "react";
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
    InputAdornment,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { sentenceCase } from "change-case";

import Page from "components/Page";
import Image from "components/Image";
import Label from "components/label";
import Table from "components/Table";
import Iconify from "components/iconify";

import { downloadFile } from "utils/files";
import ClientOnly from "components/ClientOnly";

export default function Clubs() {
    const { asPath } = useRouter();
    const { loading, error, data: { allClubs: clubs } = {} } = useQuery(GET_ALL_CLUBS);

    const [filteredClubs, setFilteredClubs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const filteredRows = clubs?.filter((club) =>
            club?.name.toLowerCase().includes(searchTerm.toLowerCase())
            ||
            club?.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClubs(filteredRows);
    }, [searchTerm, clubs]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

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
                            {loading ? null : error ? null : (
                                <Table
                                    data={filteredClubs}
                                    header={ClubsTableHeader}
                                    row={ClubsTableRow}
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

function ClubsTableHeader() {
    return (
        <TableRow>
            <TableCell align="left">Club</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Category</TableCell>
            <TableCell align="center">Status</TableCell>
        </TableRow>
    );
}

function ClubsTableRow(club) {
    const router = useRouter();
    const { cid, name, logo, email, category, state } = club;

    return (
        <TableRow
            hover
            onClick={() => router.push(`/manage/clubs/${cid}`)}
            sx={{ cursor: "pointer" }}
        >
            <TableCell align="left" sx={{ display: "flex", alignItems: "center", border: "none" }}>
                <Image
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
        </TableRow>
    );
}
