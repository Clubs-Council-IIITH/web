import { Box, Typography } from "@mui/material";
import { useMode } from "contexts/ModeContext";
import Image from "next/image";

const Error404Light = "/assets/vector/404_light.svg";
const Error404Dark = "/assets/vector/404_dark.svg";

export default function Custom404() {
    const { isLight } = useMode();

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
                    src={isLight ? Error404Light: Error404Dark}
                    alt="404: Page Not Found"
                    width="350px"
                    style={{ maxWidth: "80vw" }}
                />
            </Box>
            <Typography variant="h5" color="textSecondary">
                page not found.
            </Typography>
        </Box>
    );
}
