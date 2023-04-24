import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import {
    Avatar,
    Box,
    Button,
    Card,
    TableRow,
    TableCell,
    Stack,
    Container,
    Typography,
    Tooltip,
} from "@mui/material";

import Page from "components/Page";
import Table from "components/Table";
import Iconify from "components/iconify";

import { useAuth } from "contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_MEMBERS } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";

import ClientOnly from "components/ClientOnly";

export default function Members() {
    return (
        <Page title="Manage Members">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h3" gutterBottom>
                        Manage Members
                    </Typography>

                    <Button
                        component={Link}
                        href="#"
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New Member
                    </Button>
                </Stack>

                <Card>
                    <Box m={1}>
                        <ClientOnly>
                            <MembersTable />
                        </ClientOnly>
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

function MembersTable() {
    const { user } = useAuth();

    // get members of current club
    const {
        loading,
        error,
        data: { members } = {},
    } = useQuery(GET_MEMBERS, {
        skip: !user?.uid,
        variables: {
            clubInput: {
                cid: user?.uid,
            },
        },
    });

    // TODO: handle loading and empty indicators
    return loading ? null : !members?.length ? null : (
        <Table data={members} header={MembersTableHeader} row={MembersTableRow} />
    );
}

function MembersTableHeader() {
    return (
        <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Positions</TableCell>
        </TableRow>
    );
}

function MembersTableRow(member) {
    const router = useRouter();

    const { cid, uid, poc, roles } = member;
    const [name, setName] = useState("");
    const [img, setImg] = useState(null);

    const {
        loading,
        error,
        data: { userProfile } = {},
    } = useQuery(GET_USER_PROFILE, {
        variables: {
            userInput: {
                uid: uid,
            },
        },
        onCompleted: ({ userProfile }) => {
            setName(`${userProfile?.firstName} ${userProfile?.lastName}`);
            // setImg(userProfile?.img);
        },
    });

    return (
        <TableRow
            hover
            onClick={() => router.push(`/manage/members/${cid}:${uid}`)}
            sx={{ cursor: "pointer" }}
        >
            <TableCell
                align="left"
                sx={{
                    border: "none",
                }}
            >
                <Box display="flex" alignItems="center">
                    <Avatar
                        src={img}
                        alt={name}
                        sx={{
                            width: 42,
                            height: 42,
                            mr: 2,
                        }}
                    />
                    <Typography
                        variant="subtitle2"
                        noWrap
                        sx={{ textTransform: "capitalize", mr: 1 }}
                    >
                        {name?.toLowerCase()}
                    </Typography>
                    {poc ? (
                        <Tooltip arrow title="Point of contact">
                            <Iconify color="error.main" icon="material-symbols:contact-emergency" />
                        </Tooltip>
                    ) : null}
                </Box>
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                {userProfile?.email}
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                {roles?.map((role, key) => (
                    <Typography
                        key={key}
                        noWrap
                        variant="body2"
                        my={1}
                        sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}
                    >
                        {role?.name}
                        <Box key={key} color="grey.400" display="inline-block" mx={0.5}>
                            ({role?.startYear} - {role?.endYear || "present"})
                        </Box>
                        <Tooltip arrow title={role?.approved ? "Approved" : "Pending approval"}>
                            <Iconify
                                color={role?.approved ? "success.main" : "warning.main"}
                                icon={role?.approved ? "eva:checkmark-outline" : "eva:refresh-fill"}
                            />
                        </Tooltip>
                    </Typography>
                ))}
            </TableCell>
        </TableRow>
    );
}
