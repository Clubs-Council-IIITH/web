import { useRouter } from "next/router";

import { Avatar, Button, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { downloadFile } from "utils/files";

export default function ClubBanner({ cid, logo, name, border = true, onclick = true, ...other }) {
    const router = useRouter();
    const theme = useTheme();

    return (
        <Box
            component={Button}
            color="black"
            display="flex"
            alignItems="center"
            border={border ? 1 : 0}
            borderColor={border ? "grey.300" : "transparent"}
            onClick={() => router.push(`/clubs/${cid}`)}
            disabled={!onclick}
            {...other}
        >
            <Avatar src={downloadFile(logo)} alt={name} sx={{ height: 18, width: 18, mr: 1 }} />
            <Typography variant="body2" fontSize={14} color={theme.palette.text.primary}>
                {name}
            </Typography>
        </Box>
    );
}
