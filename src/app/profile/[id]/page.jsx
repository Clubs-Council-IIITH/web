import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Container, Grid, Stack, Typography } from "@mui/material";

import ActionPalette from "components/ActionPalette";
import ClubLogo from "components/clubs/ClubLogo";
import UserImage from "components/users/UserImage";
import UserDetails from "components/profile/UserDetails";
import { EditUser } from "components/profile/UserActions";

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

  // get currently logged in user
  const {
    data: { userMeta: currentUserMeta, userProfile: currentUserProfile } = {},
  } = await getClient().query(GET_USER, { userInput: null });
  const currentUser = { ...currentUserMeta, ...currentUserProfile };

  // get target user
  const { data: { userProfile, userMeta } = {} } = await getClient().query(
    GET_USER_PROFILE,
    {
      userInput: {
        uid: id,
      },
    }
  );
  const user = { ...userMeta, ...userProfile };

  // if user is a club, display the club's logo as profile picture
  let club = null;
  if (user.role === "club") {
    const { data: { club: targetClub } = {} } = await getClient().query(
      GET_CLUB,
      { clubInput: { cid: user.uid } }
    );
    club = targetClub;
  }

  return (
    <Container>
      {/* 
        show action palette only
        1. if current user is CC, or
        2. if current user is viewing their own profile and is not a club
      */}
      {currentUser.role === "cc" ||
      (currentUser.uid === user.uid && user.role !== "club") ? (
        <ActionPalette right={[EditUser]} />
      ) : null}
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
