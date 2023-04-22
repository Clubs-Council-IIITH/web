import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import PropTypes from "prop-types";

import { GET_USER_PROFILE } from "gql/queries/users";

import { styled } from "@mui/material/styles";
import { Box, Card, Avatar, Divider, Typography, Stack } from "@mui/material";
import { bgBlur } from "utils/cssStyles";

import Image from "components/Image";
import { downloadFile } from "utils/files";

const OverlayStyle = styled("div")(({ theme }) => ({
    ...bgBlur({ blur: 2, color: theme.palette.accent }),
    top: 0,
    zIndex: 8,
    content: "''",
    width: "100%",
    height: "100%",
    position: "absolute",
}));

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
};

export default function UserCard({ user }) {
    const { uid, roles } = user;
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
            // setImg(downloadFile(userProfile?.img));
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
                    {name?.toLowerCase()}
                </Typography>

                {roles.map((role, key) => (
                    <Box
                        key={key}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mt={0.5}
                    >
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {role?.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="grey.400"
                            display="inline-block"
                            ml={0.5}
                        >
                            ({role?.startYear} - {role?.endYear || "present"})
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Card>
    );
}
