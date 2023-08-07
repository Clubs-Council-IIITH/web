import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_USER } from "gql/queries/auth";

import { Container, Grid, Stack, Typography } from "@mui/material";

import ClubLogo from "components/clubs/ClubLogo";
import UserImage from "components/users/UserImage";
import UserDetails from "components/profile/UserDetails";

export async function generateMetadata() {
  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null }
  );
  const user = { ...userMeta, ...userProfile };

  return {
    title: `${user.firstName} ${user.lastName}`,
  };
}

export default async function Profile() {
  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null }
  );
  const user = { ...userMeta, ...userProfile };

  // if user is a club, display the club's logo as profile picture
  let club = null;
  if (user.role === "club") {
    const { data: { club: targetClub } = {} } = await getClient().query(
      GET_CLUB,
      {
        clubInput: { cid: user.uid },
      }
    );
    club = targetClub;
  }

  return (
    <Container>
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={4}>
            {club ? (
              <ClubLogo
                name={club.name}
                logo={club.logo}
                width={150}
                height={150}
              />
            ) : (
              <UserImage
                image={user.img}
                name={user.firstName}
                gender={user.gender}
                width={150}
                height={150}
              />
            )}
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
