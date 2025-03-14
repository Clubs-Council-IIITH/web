import { getClient } from "gql/client";
import { GET_CLUB, GET_MEMBERSHIPS } from "gql/queries/clubs";
import { GET_USER } from "gql/queries/auth";
import { GET_USER_PROFILE } from "gql/queries/users";
import { notFound } from "next/navigation";

import { Container, Grid, Stack, Typography } from "@mui/material";

import ActionPalette from "components/ActionPalette";
import ClubLogo from "components/clubs/ClubLogo";
import UserImage from "components/users/UserImage";
import UserDetails from "components/profile/UserDetails";
import { EditUser } from "components/profile/UserActions";
import UserMemberships from "components/profile/UserMemberships";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const { data: { userProfile, userMeta } = {} } = await getClient().query(
      GET_USER_PROFILE,
      {
        userInput: {
          uid: id,
        },
      },
    );
    const user = { ...userMeta, ...userProfile };

    if (userProfile === null || userMeta === null) {
      notFound();
    }

    return {
      title: `${user.firstName} ${user.lastName}`,
    };
  } catch (error) {
    notFound();
  }
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
    },
  );
  const user = { ...userMeta, ...userProfile };

  // if user is a club, display the club's logo as profile picture
  let club = null;
  if (user?.role === "club") {
    const { data: { club: targetClub } = {} } = await getClient().query(
      GET_CLUB,
      { clubInput: { cid: user.uid } },
    );
    club = targetClub;
  }

  // get memberships if user is a person
  let memberships = [];
  if (user?.role === "public") {
    const {
      data: { memberRoles },
    } = await getClient().query(GET_MEMBERSHIPS, {
      uid: user.uid,
    });

    // get list of memberRoles.roles along with member.cid
    memberships = memberRoles.reduce(
      (cv, m) => cv.concat(m.roles.map((r) => ({ ...r, cid: m.cid }))),
      [],
    );

    if (memberships?.length === 0 && currentUser?.uid !== user.uid) {
      notFound();
    }
  }

  return (
    <Container>
      {/*
        show action palette only
        1. if current user is CC, or
        2. if current user is viewing their own profile and is not a club
      */}
      {!["club", "cc"].includes(user?.role) &&
      (currentUser?.role === "cc" ||
        (memberships?.length !== 0 && currentUser?.uid === user?.uid)) ? (
        <ActionPalette right={[EditUser]} rightJustifyMobile="flex-end" />
      ) : null}
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            alignItems="center"
            spacing={4}
          >
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
              <Typography
                variant="h2"
                textAlign={{ xs: "center", lg: "left" }}
                sx={{
                  fontSize: { xs: 25, lg: 38 },
                  wordBreak: "break-word",
                }}
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                fontFamily="monospace"
                textAlign={{ xs: "center", lg: "left" }}
                sx={{
                  fontSize: { xs: 14, lg: 20 },
                }}
              >
                {user.email}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        {/* Show user details only for students */}
        {user?.batch?.toLowerCase()?.includes("2k") ? ( // hacky way to exclude faculty and staff
          <>
            <Grid item container xs spacing={2} mt={5}>
              <UserDetails user={user} />
            </Grid>

            <Grid item xs={12} lg={9} mt={{ xs: 2, lg: 5 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="subtitle2" textTransform="uppercase">
                  Memberships
                </Typography>
                <UserMemberships rows={memberships} />
              </Stack>
            </Grid>
          </>
        ) : null}
      </Grid>
    </Container>
  );
}
