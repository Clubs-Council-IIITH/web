import { useState } from "react";
import { useQuery } from "@apollo/client";
import PropTypes from "prop-types";

import { GET_USER_PROFILE } from "gql/queries/users";

import { styled } from "@mui/material/styles";
import { Box, Card, Avatar, Typography } from "@mui/material";
import { bgBlur } from "utils/cssStyles";

import Image from "components/Image";
import { downloadFile } from "utils/files";

import GenAvatar, { genConfig } from "react-nice-avatar";

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
        onCompleted: ({ userProfile, userMeta }) => {
            setName(`${userProfile?.firstName} ${userProfile?.lastName}`);
            setImg(downloadFile(userMeta?.img));
        },
    });

    return loading ? null : !userProfile ? null : (
        <Card>
            <Box sx={{ position: "relative" }}>
                {img ? (
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
                ) : (
                    <Box
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
                    >
                        <GenAvatar
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                            {...genConfig({
                                sex:
                                    userProfile?.gender?.toLowerCase() === "male" ? "man" : "woman",
                            })}
                        />
                    </Box>
                )}
                <OverlayStyle />
                <Image src={img} alt={name} ratio="16/9" />
            </Box>
            <Box pb={4} textAlign={"center"}>
                <Typography variant="subtitle1" sx={{ mt: 6, textTransform: "capitalize" }}>
                    {name?.toLowerCase()}
                </Typography>

                {roles?.map((role, key) => (
                    <Box key={key} mt={0.5}>
                        <Typography
                            variant="body2"
                            sx={{ display: "inline-block", color: "text.secondary" }}
                        >
                            {role?.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="grey.400"
                            sx={{
                                display: "inline-block",
                            }}
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
