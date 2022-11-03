import PropTypes from "prop-types";
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
    // const { name, cover, position, follower, totalPost, avatarUrl, following } = user;
    const {
        user: { firstName, lastName, img, mail },
        role,
    } = user;

    return (
        <Card sx={{ textAlign: "center" }}>
            <Box sx={{ position: "relative" }}>
                <Avatar
                    alt={`${firstName} ${lastName}`}
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
                <Typography variant="subtitle1" sx={{ mt: 6 }}>
                    {`${firstName} ${lastName}`}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {role}
                </Typography>
            </Box>
        </Card>
    );
}
