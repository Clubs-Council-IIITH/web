import Link from "next/link";

import { getClient } from "gql/client";
import { GET_ALL_CLUBS } from "gql/queries/clubs";

import { Container, Typography, Button, Stack } from "@mui/material";

import Icon from "components/Icon";
import ClubsTable from "components/clubs/ClubsTable";

export const metadata = {
  title: "Manage Clubs",
};

export default async function ManageClubs() {
  const { data: { allClubs: clubs } = {} } =
    await getClient().query(GET_ALL_CLUBS);

  return (
    <Container>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3
        }}>
        <Typography variant="h3" gutterBottom>
          Manage Clubs & Student Bodies
        </Typography>

        <Button
          component={Link}
          href="/manage/clubs/new"
          variant="contained"
          startIcon={<Icon variant="add" />}
        >
          New Club/Body
        </Button>
      </Stack>
      <ClubsTable clubs={clubs} />
    </Container>
  );
}
