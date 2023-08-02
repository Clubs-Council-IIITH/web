import { getClient } from "gql/client";
import { GET_MEMBER } from "gql/queries/members";

import { Container, Grid, Stack, Typography } from "@mui/material";
import UserImage from "components/users/UserImage";
import MemberPositions from "components/members/MemberPositions";

export const metadata = {
  title: "Viewing Member",
};

export default async function ManageMember({ params }) {
  const { id } = params;

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

  return (
    <Container>
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={4}>
            <UserImage
              image={userMeta.img}
              name={userProfile.firstName}
              gender={userProfile.gender}
              width={150}
              height={150}
            />
            <Stack direction="column" spacing={1}>
              <Typography variant="h2" wordWrap="break-word">
                {userProfile.firstName} {userProfile.lastName}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                fontFamily="monospace"
              >
                {userProfile.email}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item container xs spacing={2} mt={5}>
          <Grid item xs>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              gutterBottom
            >
              Point of Contact
            </Typography>
            <Typography variant="h5" fontWeight={400}>
              {member.poc ? "Yes" : "No"}
            </Typography>
          </Grid>
          <Grid item xs={12} lg={8}>
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
      </Grid>
    </Container>
  );
}
