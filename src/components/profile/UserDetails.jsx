import { Box, Stack, Typography } from "@mui/material";

export default function UserDetails({ user }) {
  return (
    <Stack direction="column" spacing={4} mx={2}>
      <Box>
        <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
          User ID
        </Typography>
        <Typography variant="h5" fontWeight={400} fontFamily="monospace">
          {user.uid}
        </Typography>
      </Box>

      {user?.batch ? (
        <Box>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Batch
          </Typography>
          <Typography variant="h5" fontWeight={400} textTransform="uppercase">
            {user.batch} · {user.stream}
          </Typography>
        </Box>
      ) : null}
    </Stack>
  );
}
