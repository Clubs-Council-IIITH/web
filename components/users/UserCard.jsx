import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import PropTypes from "prop-types";

import { GET_USER_PROFILE } from "gql/queries/users";

// @mui
import { styled } from "@mui/material/styles";
import { Box, Card, Avatar, Divider, Typography, Stack } from "@mui/material";
// utils
import { bgBlur } from "utils/cssStyles";
// components
import Image from "components/Image";

// ----------------------------------------------------------------------

const OverlayStyle = styled("div")(({ theme }) => ({
    ...bgBlur({ blur: 2, color: theme.palette.accent }),
    top: 0,
    zIndex: 8,
    content: "''",
    width: "100%",
    height: "100%",
    position: "absolute",
}));

// ----------------------------------------------------------------------

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
};

export default function UserCard({ user }) {
    const { cid, uid, role, startYear, endYear, approved } = user;
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
        <Card sx={{ textAlign: "center" }}>
            <Box sx={{ position: "relative" }}>
                <Avatar
                    alt={name}
                    src={img}
                    sx={{
                        width: 128,
                        height: 128,
                        zIndex: 11,
                        left: 0,
                        right: 0,
                        bottom: -32,
                        mx: "auto",
                        position: "absolute",
                    }}
                />
                <OverlayStyle />
                <Image src={img} alt={img} ratio="16/9" />
            </Box>
            <Box pb={4}>
                <Typography variant="subtitle1" sx={{ mt: 6, textTransform: "capitalize" }}>
                    {name.toLowerCase()}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {role}
                </Typography>

                <Typography variant="body2" mt={2} sx={{ color: "grey.400" }}>
                    {startYear} - {endYear || "present"}
                </Typography>
            </Box>
        </Card>
    );
}
