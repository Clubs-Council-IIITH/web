import { Box, Container, Typography } from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_PENDING_MEMBERS } from "gql/queries/members";
import { GET_USER_PROFILE } from "gql/queries/users";

import { enrichMembers } from "app/manage/members/page"
import MembersTable from "components/members/MembersTable";

async function PendingMembersDataGrid() {
  const { data: { pendingMembers } = {} } =
    await getClient().query(GET_PENDING_MEMBERS);
  const processedMembers = await enrichMembers(pendingMembers);

  return processedMembers.length > 0 ? (
    <MembersTable
      members={processedMembers}
      showClub={true}
      showIcon={false}
    />
  ) : null;
}

export default async function PendingMembers() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Pending Member Approvals
      </Typography>
      <PendingMembersDataGrid />
    </Container>
  )
}
