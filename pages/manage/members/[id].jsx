import { useState } from "react";

import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";
import { GET_MEMBER } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Avatar, Box, Card, Grid, Container, Typography } from "@mui/material";

import Label from "components/label";
import Page from "components/Page";
import Iconify from "components/iconify";
import ClientOnly from "components/ClientOnly";

export default function Member() {
    const { query } = useRouter();
    const { id } = query;

    const [name, setName] = useState("");
    const [img, setImg] = useState(null);

    // get member
    const {
        loading,
        error,
        data: { member, userProfile } = {},
    } = useQuery(GET_MEMBER, {
        skip: !id,
        variables: {
            memberInput: {
                cid: id?.split(":")[0],
                uid: id?.split(":")[1],
                rid: null,
            },
            userInput: {
                uid: id?.split(":")[1],
            },
        },
        onCompleted: ({ userProfile }) => {
            setName(`${userProfile?.firstName} ${userProfile?.lastName}`);
            // setImg(userProfile?.img);
        },
    });

    // TODO: handle loading and null state
    return loading ? null : !member ? null : (
        <Page title={"View Member"}>
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} xl={4}>
                        <Card sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="center" width="100%">
                                        <Avatar
                                            src={img}
                                            alt={name}
                                            sx={{
                                                width: 200,
                                                height: 200,
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item width="100%">
                                    <Typography
                                        variant="h3"
                                        align="center"
                                        fontWeight={400}
                                        textTransform="capitalize"
                                    >
                                        {name?.toLowerCase()}
                                    </Typography>

                                    <Box mt={4}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            EMAIL
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            fontWeight={400}
                                            textTransform="lowercase"
                                        >
                                            <code>{userProfile?.email}</code>
                                        </Typography>

                                        <Typography
                                            mt={3}
                                            variant="subtitle2"
                                            color="text.secondary"
                                        >
                                            MEMBER SINCE
                                        </Typography>
                                        <Typography variant="body1">
                                            {Math.min(
                                                ...member?.roles?.map((role) => role.startYear)
                                            )}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid item xs md lg xl>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                POINT OF CONTACT
                            </Typography>
                            <Typography variant="body1">{member?.poc ? "Yes" : "No"}</Typography>

                            <Typography mt={4} variant="subtitle2" color="text.secondary">
                                POSITIONS HELD
                            </Typography>

                            <Grid container spacing={2}>
                                {member?.roles?.map((role, key) => (
                                    <Grid item container xs={12} mt={1}>
                                        <Grid item xs={3}>
                                            <Typography fontWeight={400} color="text.secondary">
                                                {role?.startYear} - {role?.endYear || "present"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography>
                                                {role?.name} asdhaskdjyh asjbd asghj bdasgjhd
                                                gbhaskj bgashjf bgjsdhfgd bvajshdg ba
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3} display="flex" justifyContent="flex-end">
                                            <Label color={role?.approved ? "success" : "warning"}>
                                                {role?.approved ? "APPROVED" : "PENDING"}
                                            </Label>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
