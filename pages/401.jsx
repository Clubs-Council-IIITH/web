import { Box, Typography } from "@mui/material";
import Image from "next/image";

const Error401SVG = "/assets/vector/401.svg";

export default function Custom401() {
    return (
        <Box
            p={4}
            width="100%"
            height="60vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Box mb={3}>
                <Image
                    src={Error401SVG}
                    alt="401: Unauthorized"
                    width="300px"
                    style={{ maxWidth: "80vw" }}
                />
            </Box>
            <Typography variant="h5" color="textSecondary">
                unauthorized.
            </Typography>
        </Box>
    );
}
