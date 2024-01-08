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
    <Stack direction="column" spacing={3} mx={2}>
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
          {user?.batch?.toLowerCase()?.includes("2k") ? ( // hacky way to exclude faculty and staff from rendering batch and stream
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

          {["cc", "slo", "slc"].includes(currentUser?.role) ||
            (currentUser?.uid === user?.uid && user?.role !== "club") ? (
            <>
              {user?.batch?.toLowerCase()?.includes("2k") ? (
                < Box >
                  <Typography
                    variant="subtitle2"
                    textTransform="uppercase"
                    gutterBottom
                  >
                    Roll Number
                  </Typography>
                  <Typography fontWeight={400}>
                    {user.rollno || "Unknown"}
                  </Typography>
                </Box>
              ) : null}
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
            </>
          ) : null}
        </>
      ) : null
      }
    </Stack >
  );
}
