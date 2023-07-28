import Link from "next/link";

import { getClient } from "gql/client";
import { GET_MEMBERS } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Container, Typography, Button, Stack } from "@mui/material";

import Icon from "components/Icon";
import MembersTable from "components/members/MembersTable";

export const metadata = {
  title: "Manage Members",
};

export default async function ManageMembers() {
  const { data: { members } = {} } = await getClient().query(GET_MEMBERS, {
    clubInput: { cid: "clubs" },
  });

  // TODO: convert MembersTable to a server component and fetch user profile for each row (for lazy-loading perf improvement)
  // concurrently fetch user profile for each member
  const userPromises = [];
  members?.forEach((member) => {
    userPromises.push(
      getClient()
        .query(GET_USER_PROFILE, {
          userInput: {
            uid: member.uid,
          },
        })
        .toPromise()
    );
  });
  const users = await Promise.all(userPromises);
  const processedMembers = members.map((member, index) => ({
    ...member,
    ...users[index].data.userProfile,
    ...users[index].data.userMeta,
    mid: `${member.cid}:${member.uid}`,
  }));

  // !TODO: dropdown for selecting club and using it as searchparam

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h3" gutterBottom>
          Manage Members
        </Typography>

        <Button
          component={Link}
          href="/manage/members/new"
          variant="contained"
          startIcon={<Icon variant="add" />}
        >
          New Member
        </Button>
      </Stack>

      <MembersTable members={processedMembers} />
    </Container>
  );
}
