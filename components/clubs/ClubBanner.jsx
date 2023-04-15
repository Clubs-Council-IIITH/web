import { useRouter } from "next/router";

import { Avatar, Button, Box, Typography } from "@mui/material";

export default function ClubBanner({ cid, logo, name, ...other }) {
    const router = useRouter();

    return (
        <Box
            component={Button}
            color="black"
            display="flex"
            alignItems="center"
            border={1}
            borderColor={"grey.300"}
            onClick={() => router.push(`/clubs/${cid}`)}
            {...other}
        >
            <Avatar src={logo} alt={name} sx={{ height: 18, width: 18, mr: 1 }} />
            <Typography variant="body2" fontSize={14}>
                {name}
            </Typography>
        </Box>
    );
}
