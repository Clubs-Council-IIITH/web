import Link from "next/link";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_MEMBERS, GET_PENDING_MEMBERS } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import Icon from "components/Icon";
import MembersTable from "components/members/MembersTable";

export const metadata = {
  title: "Manage Members",
};

export default async function ManageMembers({ searchParams }) {
  const { club } = searchParams;

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = { ...userMeta, ...userProfile };

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

      {/* only pending members */}
      {user?.role === "cc" ? (
        <Box mb={3}>
          <Typography
            color="text.secondary"
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Pending Approval
          </Typography>
          <PendingMembersDataGrid />
        </Box>
      ) : null}

      {/* all members */}
      <Box>
        {user?.role === "cc" ? (
          <>
            <Typography
              color="text.secondary"
              variant="subtitle2"
              textTransform="uppercase"
              gutterBottom
              mb={2}
            >
              All Members
            </Typography>
            <MembersClubSelect club={club} />
          </>
        ) : null}
        {user?.role === "club" || club ? (
          <MembersDataGrid club={user?.role === "club" ? user?.uid : club} />
        ) : null}
      </Box>
    </Container>
  );
}

async function MembersClubSelect({ club }) {
  const { data: { allClubs } = {} } = await getClient().query(
    GET_ALL_CLUB_IDS,
    {},
  );

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="club">Select a Club</InputLabel>
      <Select value={club} labelId="club" label="Select a Club" fullWidth>
        {allClubs
          ?.slice()
          ?.sort((a, b) => a.name.localeCompare(b.name))
          ?.map((club) => (
            <MenuItem
              component={Link}
              shallow
              href={`/manage/members?club=${club.cid}`}
              key={club.cid}
              value={club.cid}
            >
              {club.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

async function PendingMembersDataGrid() {
  const { data: { pendingMembers } = {} } = await getClient().query(
    GET_PENDING_MEMBERS,
  );

  // TODO: convert MembersTable to a server component and fetch user profile for each row (for lazy-loading perf improvement)
  // concurrently fetch user profile for each member
  const userPromises = [];
  pendingMembers?.forEach((member) => {
    userPromises.push(
      getClient()
        .query(GET_USER_PROFILE, {
          userInput: {
            uid: member.uid,
          },
        })
        .toPromise(),
    );
  });
  const users = await Promise.all(userPromises);
  const processedMembers = pendingMembers.map((member, index) => ({
    ...member,
    ...users[index].data.userProfile,
    ...users[index].data.userMeta,
    mid: `${member.cid}:${member.uid}`,
  }));

  return <MembersTable members={processedMembers} />;
}

async function MembersDataGrid({ club }) {
  const { data: { members } = {} } = await getClient().query(GET_MEMBERS, {
    clubInput: { cid: club },
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
        .toPromise(),
    );
  });
  const users = await Promise.all(userPromises);
  const processedMembers = members.map((member, index) => ({
    ...member,
    ...users[index].data.userProfile,
    ...users[index].data.userMeta,
    mid: `${member.cid}:${member.uid}`,
  }));

  return <MembersTable members={processedMembers} />;
}
