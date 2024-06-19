import { getClient } from "gql/client";
import { GET_HOLIDAYS } from "gql/queries/holidays";

import { Container, Stack, Typography } from "@mui/material";

import HolidaysTable from "components/holidays/HolidaysTable";

export const metadata = {
  title: "Manage Holidays",
};

export default async function ManageHolidays() {
  const { data: { holidays } = {} } = await getClient().query(GET_HOLIDAYS);

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h3" gutterBottom>
          Manage Holidays
        </Typography>
      </Stack>

      <HolidaysTable holidays={holidays} />
    </Container>
  );
}
