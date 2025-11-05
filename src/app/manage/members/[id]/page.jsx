import { getClient } from "gql/client";
import { GET_MEMBER } from "gql/queries/members";
import { GET_USER } from "gql/queries/auth";
import { redirect, notFound } from "next/navigation";

import { Container, Grid, Stack, Typography } from "@mui/material";

import UserImage from "components/users/UserImage";
import MemberPositions from "components/members/MemberPositions";
import MemberActionsList from "components/members/MemberActionsList";
import ClubButton from "components/clubs/ClubButton";
import { getUserNameFromUID } from "utils/users";

export const metadata = {
  title: "Viewing Member",
};

export default async function ManageMember(props) {
  const params = await props.params;
  const { id } = params;
  const [cid, uid] = id?.split(encodeURIComponent(":"));

  try {
    const {
      data: { member, userMeta, userProfile },
    } = await getClient().query(GET_MEMBER, {
      memberInput: {
        cid: cid,
        uid: uid,
        rid: null,
      },
      userInput: {
        uid: uid,
      },
    });

    if (userMeta === null) {
      notFound();
    }

    let user = { ...userMeta, ...userProfile };
    if (userProfile === null) {
      const name = getUserNameFromUID(uid);
      const userProfile1 = {
        firstName: name.firstName,
        lastName: name.lastName,
        email: null,
        gender: null,
      };
      user = { ...userMeta, ...userProfile1 };
    }

    // fetch currently logged in user
    const {
      data: { userMeta: currentUserMeta, userProfile: currentUserProfile } = {},
    } = await getClient().query(GET_USER, { userInput: null });
    const currentUser = { ...currentUserMeta, ...currentUserProfile };

    return (
      <Container>
        <MemberActionsList
          member={member}
          user={currentUser}
          allowEditing={userProfile != null}
        />
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              alignItems="center"
              spacing={4}
            >
              <UserImage
                image={user.img}
                name={user?.firstName}
                gender={user?.gender}
                width={150}
                height={150}
              />
              <Stack direction="column" spacing={1}>
                <Typography variant="h2" word-wrap="break-word">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontFamily="monospace"
                >
                  {user?.email || "Email Not Available"}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item container xs spacing={1} mt={5}>
            <Grid item xs>
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                gutterBottom
              >
                Point of Contact
              </Typography>
              <Typography variant="h5" fontWeight={300}>
                {member.poc ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                gutterBottom
              >
                Club/Body
              </Typography>
              <ClubButton clubid={id?.split(encodeURIComponent(":"))[0]} />
            </Grid>
          </Grid>
          <Grid item container mt={3}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                gutterBottom
              >
                Positions
              </Typography>
              <MemberPositions
                rows={member?.roles?.map((r, key) => ({
                  ...r,
                  id: r?.mid || key,
                }))} // add ID to each position item if it doesn't exist (MUI requirement)
                editable={false}
                member={member}
              />
            </Grid>
          </Grid>
          <Grid item container xs spacing={1} mt={5}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                gutterBottom
              >
                Creation Time
              </Typography>
              <Typography variant="body" color="#777777" fontWeight="100">
                {member.creationTime
                  ? member.creationTime
                  : "Information Not Available"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                gutterBottom
              >
                Last Edited Time
              </Typography>
              <Typography variant="body" color="#777777" fontWeight="100">
                {member.lastEditedTime
                  ? member.lastEditedTime
                  : "Information Not Available"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  } catch (error) {
    return redirect("/404");
  }
}
