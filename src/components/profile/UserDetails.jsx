import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";

import { Box, Stack, Typography } from "@mui/material";

export default async function UserDetails({ user }) {
  // get currently logged in user
  const {
    data: { userMeta: currentUserMeta, userProfile: currentUserProfile } = {},
  } = await getClient().query(GET_USER, { userInput: null });
  const currentUser = { ...currentUserMeta, ...currentUserProfile };

  return (
    <Stack direction="column" spacing={4} mx={2}>
      <Box>
        <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
          User ID
        </Typography>
        <Typography fontWeight={400} fontFamily="monospace">
          {user.uid}
        </Typography>
      </Box>

      {user?.role !== "club" ? (
        <>
          {user?.batch ? (
            <Box>
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                gutterBottom
              >
                Batch
              </Typography>
              <Typography fontWeight={400} textTransform="uppercase">
                {user.batch} · {user.stream}
              </Typography>
            </Box>
          ) : null}

          {currentUser?.role === "cc" ? (
            <Box>
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                gutterBottom
              >
                Phone Number
              </Typography>
              <Typography fontWeight={400}>
                {user.phone || "Unknown"}
              </Typography>
            </Box>
          ) : null}
        </>
      ) : null}
    </Stack>
  );
}
