import { redirect } from "next/navigation";

import { Box, Button, Container, Stack, Typography } from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ACTIVE_CLUB_IDS } from "gql/queries/clubs";
import { GET_CURRENT_MEMBERS, GET_MEMBERS } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";

import Icon from "components/Icon";
import ButtonLink from "components/Link";
import MembersFilter from "components/members/MembersFilter";
import MembersTable from "components/members/MembersTable";

export const metadata = { title: "Manage Members" };

// Fetch and merge user profiles into member objects
export async function enrichMembers(members) {
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

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = { ...userMeta, ...userProfile };
  const isElevated = ["cc", "slo"].includes(userMeta?.role);

  // If initial search params are missing, redirect immediately so URL has default params
  const defaultClub = targetClub || user?.uid;
  const needsClub = !targetClub && !!defaultClub;
  const needsCurrent = current === undefined;
  const needsPast = past === undefined;

  if (needsClub || needsCurrent || needsPast) {
    const params = new URLSearchParams();
    if (defaultClub) params.set("club", defaultClub);
    params.set("current", current ?? "true");
    params.set("past", past ?? "false");

    redirect(`/manage/members?${params.toString()}`);
  }

  const onlyCurrent = current === "true";
  const onlyPast = past === "true";
  const targetState = [
    ...(onlyCurrent ? ["current"] : []),
    ...(onlyPast ? ["past"] : []),
  ];

  let clubs = [];
  if (isElevated) {
    const { data: { allClubs } = {} } = await getClient().query(
      GET_ACTIVE_CLUB_IDS,
      {},
    );
    clubs = allClubs || [];
  }

  const activeClub = targetClub || user?.uid;

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

      <Box>
        <Box sx={{ mt: 2, mb: 3 }}>
          <MembersFilter
            club={activeClub}
            state={targetState}
            elevated={isElevated}
            clubs={clubs}
          />
        </Box>

        {activeClub && (
          <MembersDataGrid
            club={activeClub}
            onlyCurrent={onlyCurrent}
            onlyPast={onlyPast}
          />
        )}
      </Box>
    </Container>
  );
}

async function MembersDataGrid({
  club,
  onlyCurrent = false,
  onlyPast = false,
}) {
  let targetMembers = [];

  if (!onlyPast && onlyCurrent) {
    const { data: { currentMembers } = {} } = await getClient().query(
      GET_CURRENT_MEMBERS,
      { clubInput: { cid: club } },
    );
    targetMembers = currentMembers || [];
  } else {
    const { data: { members } = {} } = await getClient().query(GET_MEMBERS, {
      clubInput: { cid: club },
    });
    const currentYear = new Date().getFullYear() + 1;

    targetMembers = (members || []).filter((member) => {
      if (onlyCurrent === onlyPast) return true;
      const isCurrent = getLatestYear(member) === currentYear;
      return onlyCurrent ? isCurrent : !isCurrent;
    });
  }

  const processedMembers = await enrichMembers(targetMembers);
  return <MembersTable members={processedMembers} />;
}
