import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Container, Grid, Stack, Typography } from "@mui/material";

import UserImage from "components/users/UserImage";
import UserDetails from "components/profile/UserDetails";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  const { data: { userProfile, userMeta } = {} } = await getClient().query(
    GET_USER_PROFILE,
    {
      userInput: {
        uid: id,
      },
    }
  );
  const user = { ...userMeta, ...userProfile };

  return {
    title: `${user.firstName} ${user.lastName}`,
  };
}

export default async function Profile({ params }) {
  const { id } = params;

  const { data: { userProfile, userMeta } = {} } = await getClient().query(
    GET_USER_PROFILE,
    {
      userInput: {
        uid: id,
      },
    }
  );
  const user = { ...userMeta, ...userProfile };

  return (
    <Container>
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <UserImage
              image={user.img}
              name={user.firstName}
              gender={user.gender}
              width={150}
              height={150}
            />
            <Stack direction="column" spacing={1}>
              <Typography variant="h2" wordWrap="break-word">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                fontFamily="monospace"
              >
                {user.email}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item container xs spacing={2} mt={5}>
          <UserDetails user={user} />
        </Grid>
      </Grid>
    </Container>
  );
}
