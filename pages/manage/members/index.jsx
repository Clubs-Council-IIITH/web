import { useEffect, useState } from "react";
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
import Label from "components/label";
import Kebab from "components/Kebab";
import Table from "components/Table";
import Iconify from "components/iconify";
import ClientOnly from "components/ClientOnly";

import { useAuth } from "contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_MEMBERS } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";
import { GET_CLUB } from "gql/queries/clubs";

import { useProgressbar } from "contexts/ProgressbarContext";

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
                        href="/manage/members/new"
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
                cid: "clubs",
            },
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return loading ? null : !members?.length ? null : (
        <Table data={members} header={MembersTableHeader} row={MembersTableRow} />
    );
}

function MembersTableHeader() {
    return (
        <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Club</TableCell>
            <TableCell align="left">Positions</TableCell>
        </TableRow>
    );
}

function MembersTableRow1(member) {
    console.log(member)
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
        ...(approved ? [] : [{
            name: (
                <Box display="flex" alignItems="center" sx={{ color: "success.main" }}>
                    <Iconify icon="eva:checkmark-outline" sx={{ mr: 1 }} />
                    Approve
                </Box>
            ),
            onClick: () => null,
        }]),
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


function MembersTableRow(member) {
    const router = useRouter();

    const { cid, uid, poc, roles, approved } = member;
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
            setImg(userProfile?.img);
        },
    });

    const {
        loading: clubLoading,
        error: clubError,
        data: { club } = {},
    } = useQuery(GET_CLUB, {
        skip: !cid,
        variables: {
            clubInput: { cid: cid },
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

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
                {club?.name}
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
