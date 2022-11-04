import { useRouter } from "next/router";

import { Avatar, Button, Box, Typography } from "@mui/material";

export default function ClubBanner({ club, ...other }) {
    const { id, img, name } = club;
    const router = useRouter();

    return (
        <Box
            component={Button}
            color="black"
            display="flex"
            alignItems="center"
            onClick={() => router.push(`/clubs/${id}`)}
            {...other}
        >
            <Avatar src={img} alt={name} sx={{ height: 18, width: 18, mr: 1 }} />
            <Typography variant="overline" fontSize={14}>
                {name}
            </Typography>
        </Box>
    );
}
