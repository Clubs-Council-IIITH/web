import { useState, useEffect } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import {
    Avatar,
    Box,
    TableRow,
    TableCell,
    Container,
    Typography,
} from "@mui/material";

import useResponsive from "hooks/useResponsive";
import { useProgressbar } from "contexts/ProgressbarContext";

import Page from "components/Page";
import Table from "components/Table";
import ClientOnly from "components/ClientOnly";
import { downloadFile } from "utils/files";

import { useQuery } from "@apollo/client";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_MEMBERS } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";

export default function ClubMembers() {
    const {
        query: { id },
    } = useRouter();

    // set title asynchronously
    const [title, setTitle] = useState("...");

    const {
        data: { club } = {},
        loading,
        error,
    } = useQuery(GET_CLUB, {
        skip: !id,
        variables: {
            clubInput: { cid: id },
        },
        onCompleted: ({ club }) => {
            setTitle(club?.name + " | Members");
        },
        onError: (error) => {
            if (error.message == "No Club Found")
                router.push(`/404`)
        },
    });

    return (
        <Page title={title}>
            <Container>
                <center>
                    {loading ? null : (
                        <Typography variant="h2" sx={{ mb: 4 }}>
                            Members - <i>{club?.name}</i>
                        </Typography>
                    )}
                </center>
                <ClientOnly>
                    <MembersTable cid={id} />
                </ClientOnly>
            </Container>
        </Page>
    );
}

function MembersTable(id) {
    const { cid } = id;
    console.log(cid)
    // get members of current club
    const {
        loading,
        error,
        data: { members } = {},
    } = useQuery(GET_MEMBERS, {
        skip: !cid,
        variables: {
            clubInput: {
                cid: cid,
            },
        },
    });

    // track loading state</center>
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
        onCompleted: ({ userProfile, userMeta }) => {
            setName(`${userProfile?.firstName} ${userProfile?.lastName}`);
            setImg(downloadFile(userMeta?.img));
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return (
        <TableRow>
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
                </Box>
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                {userProfile?.email}
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
                {roles
                    ?.filter((role) => role?.approved && !role?.deleted)
                    ?.map((role, key) => (
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
                        </Typography>
                    ))}
            </TableCell>
        </TableRow>
    );
}