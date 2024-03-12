import Link from "next/link";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_MEMBERS, GET_PENDING_MEMBERS } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Box, Container, Typography, Button, Stack } from "@mui/material";

import Icon from "components/Icon";
import MembersTable from "components/members/MembersTable";
import MembersFilter from "components/members/MembersFilter";

export const metadata = {
  title: "Manage Members",
};

export default async function ManageMembers({ searchParams }) {
  const targetName = searchParams?.name;
  const targetClub = searchParams?.club;
  const targetState = [
    ...(searchParams?.upcoming === "true" ? ["upcoming"] : []),
    ...(searchParams?.completed === "true" ? ["completed"] : []),
  ];
  const onlyCurrent = searchParams?.upcoming === "true" ? true : false;
  const onlyPast = searchParams?.completed === "true" ? true : false;

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
      {user?.role === "cc" ? <PendingMembersDataGrid /> : null}

      {/* all members */}
      <Box>
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
              <Box mt={2} mb={3}>
                <MembersFilter
                  name={targetName}
                  club={targetClub}
                  state={targetState}
                  cc={true}
                />
              </Box>
            </>
          ) : null}
          {user?.role === "club" || targetClub ? (
            <>
              {user?.role !== "cc" ? (
                <>
                  <Box mt={2} mb={3}>
                    <MembersFilter
                      name={targetName}
                      club={targetClub}
                      state={targetState}
                      cc={false}
                    />
                  </Box>
                </>
              ) : null}
              <MembersDataGrid
                club={user?.role === "club" ? user?.uid : targetClub}
                onlyCurrent={onlyCurrent}
                onlyPast={onlyPast}
              />
            </>
          ) : null}
        </Box>
      </Box>
    </Container>
  );
}

async function PendingMembersDataGrid() {
  const { data: { pendingMembers } = {} } =
    await getClient().query(GET_PENDING_MEMBERS);

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

  return (
    <>
      {processedMembers.length > 0 ? (
        <Box mb={3}>
          <Typography
            color="text.secondary"
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Pending Approval
          </Typography>
          <MembersTable members={processedMembers} showClub={true} />
        </Box>
      ) : null}
    </>
  );
}

async function MembersDataGrid({
  club,
  onlyCurrent = false,
  onlyPast = false,
}) {
  const { data: { members } = {} } = await getClient().query(GET_MEMBERS, {
    clubInput: { cid: club },
  });

  const currentYear = (new Date().getFullYear() + 1).toString();

  // filter only the required members (current | past | both)
  const targetMembers = members?.filter((member) => {
    const latestYear = extractLatestYear(member).toString();
    const isCurrent = onlyCurrent && latestYear === currentYear;
    const isPast = onlyPast && latestYear !== currentYear;

    return (!onlyCurrent && !onlyPast) || isCurrent || isPast;
  });

  // TODO: convert MembersTable to a server component and fetch user profile for each row (for lazy-loading perf improvement)
  // concurrently fetch user profile for each member
  const userPromises = [];
  targetMembers?.forEach((member) => {
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
  const processedMembers = targetMembers.map((member, index) => ({
    ...member,
    ...users[index].data.userProfile,
    ...users[index].data.userMeta,
    mid: `${member.cid}:${member.uid}`,
  }));

  return <MembersTable members={processedMembers} />;
}

// get the last year a member was in the club
// if member is still present, return current year + 1
function extractLatestYear(member) {
  return Math.max(
    ...member.roles.map((r) =>
      !r.endYear ? new Date().getFullYear() + 1 : r.endYear,
    ),
  );
}
