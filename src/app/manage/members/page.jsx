import { Box, Button, Container, Stack, Typography } from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_MEMBERS, GET_PENDING_MEMBERS } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";

import Icon from "components/Icon";
import ButtonLink from "components/Link";
import MembersFilter from "components/members/MembersFilter";
import MembersTable from "components/members/MembersTable";
export const metadata = { title: "Manage Members" };

// Fetch and merge user profiles into member objects
async function enrichMembers(members) {
  if (!members?.length) return [];

  const { document, variables } = combineQuery("CompositeMembers").addN(
    GET_USER_PROFILE,
    members.map((m) => ({ userInput: { uid: m.uid } })),
  );
  const { data } = await getClient().query(document, variables);

  return members.map((member, i) => ({
    ...member,
    ...data?.[`userProfile_${i}`],
    ...data?.[`userMeta_${i}`],
    mid: `${member.cid}:${member.uid}`,
  }));
}

// Get the latest year a member was active (currentYear+1 if still active)
function getLatestYear(member) {
  const currentYear = new Date().getFullYear() + 1;
  return Math.max(...member.roles.map((r) => r.endYear ?? currentYear));
}

export default async function ManageMembers({ searchParams }) {
  const { club: targetClub, current, past } = await searchParams;
  const onlyCurrent = current === "true";
  const onlyPast = past === "true";
  const targetState = [
    ...(onlyCurrent ? ["current"] : []),
    ...(onlyPast ? ["past"] : []),
  ];

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = { ...userMeta, ...userProfile };
  const isCC = user?.role === "cc" || user?.role === "slo";
  const isClub = user?.role === "club";

  return (
    <Container>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 3 }}
      >
        <Typography variant="h3" gutterBottom>
          Manage Members
        </Typography>
        <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
          {[
            {
              href: "/manage/members/bulk-add",
              icon: "playlist-add",
              label: "Bulk Add",
              color: "primary",
            },
            {
              href: "/manage/members/bulk-edit",
              icon: "edit",
              label: "Bulk Edit",
              color: "warning",
            },
            {
              href: "/manage/members/new",
              icon: "add",
              label: "New Member",
              color: "secondary",
            },
          ].map(({ href, icon, label, color }) => (
            <Button
              key={href}
              component={ButtonLink}
              href={href}
              variant="contained"
              color={color}
              startIcon={<Icon variant={icon} />}
            >
              {label}
            </Button>
          ))}
        </Stack>
      </Stack>

      {isCC && <PendingMembersDataGrid />}

      <Box>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            mb: 2,
          }}
        >
          All Members
        </Typography>
        <Box sx={{ mt: 2, mb: 3 }}>
          <MembersFilter
            club={targetClub || user?.uid}
            state={targetState}
            cc={isCC}
          />
        </Box>

        {(isClub || targetClub) && (
          <MembersDataGrid
            club={isClub ? user?.uid : targetClub}
            onlyCurrent={onlyCurrent}
            onlyPast={onlyPast}
          />
        )}
      </Box>
    </Container>
  );
}

async function PendingMembersDataGrid() {
  const { data: { pendingMembers } = {} } =
    await getClient().query(GET_PENDING_MEMBERS);
  const processedMembers = await enrichMembers(pendingMembers);

  return processedMembers.length > 0 ? (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ color: "text.secondary", textTransform: "uppercase" }}
      >
        Pending Approval
      </Typography>
      <MembersTable
        members={processedMembers}
        showClub={true}
        showIcon={false}
      />
    </Box>
  ) : null;
}

async function MembersDataGrid({
  club,
  onlyCurrent = false,
  onlyPast = false,
}) {
  const { data: { members } = {} } = await getClient().query(GET_MEMBERS, {
    clubInput: { cid: club },
  });
  const currentYear = new Date().getFullYear() + 1;

  const targetMembers = members?.filter((member) => {
    if (onlyCurrent === onlyPast) return true;
    const isCurrent = getLatestYear(member) === currentYear;
    return onlyCurrent ? isCurrent : !isCurrent;
  });

  const processedMembers = await enrichMembers(targetMembers);
  return <MembersTable members={processedMembers} />;
}
