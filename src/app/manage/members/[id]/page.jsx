import { getClient } from "gql/client";
import { GET_MEMBER } from "gql/queries/members";
import { GET_USER } from "gql/queries/auth";
import { redirect } from "next/navigation";

import { Container, Grid, Stack, Typography } from "@mui/material";

import UserImage from "components/users/UserImage";
import MemberPositions from "components/members/MemberPositions";
import MemberActionsList from "components/members/MemberActionsList";
import ClubButton from "components/clubs/ClubButton";

export const metadata = {
  title: "Viewing Member",
};

export default async function ManageMember({ params }) {
  const { id } = params;

  try {
    const {
      data: { member, userMeta, userProfile },
    } = await getClient().query(GET_MEMBER, {
      memberInput: {
        cid: id?.split(encodeURIComponent(":"))[0],
        uid: id?.split(encodeURIComponent(":"))[1],
        rid: null,
      },
      userInput: {
        uid: id?.split(encodeURIComponent(":"))[1],
      },
    });

    if (userMeta === null) {
      return redirect("/404");
    }

    // fetch currently logged in user
    const {
      data: { userMeta: currentUserMeta, userProfile: currentUserProfile } = {},
    } = await getClient().query(GET_USER, { userInput: null });
    const user = { ...currentUserMeta, ...currentUserProfile };

    return (
      <Container>
        <MemberActionsList member={member} user={user} />
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              alignItems="center"
              spacing={4}
            >
              <UserImage
                image={userMeta.img}
                name={userProfile?.firstName}
                gender={userProfile?.gender}
                width={150}
                height={150}
              />
              <Stack direction="column" spacing={1}>
                <Typography variant="h2" word-wrap="break-word">
                  {userProfile?.firstName} {userProfile?.lastName}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontFamily="monospace"
                >
                  {userProfile?.email}
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
