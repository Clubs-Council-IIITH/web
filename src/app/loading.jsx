import { Box, Fade, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box py={25} width="100%" display="flex" justifyContent="center">
      <Fade in>
        <CircularProgress color="primary" />
      </Fade>
    </Box>
  );
}
