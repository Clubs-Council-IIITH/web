import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ALL_EVENTS_BILLS_STATUS } from "gql/queries/events";

import { Container, Stack, Typography } from "@mui/material";

import FinancesTable from "components/events/bills/FinancesTable";

export const metadata = {
  title: "Manage Finances",
};

export default async function ManageBills() {
  const response = await getClient().query(GET_ALL_EVENTS_BILLS_STATUS);
  const allEventsBills = response?.data?.allEventsBills || [];

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = { ...userMeta, ...userProfile };

  const filterEventsbyState = (states) =>
    allEventsBills.filter((event) =>
      states.includes(event?.billsStatus?.state),
    );

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h3" gutterBottom>
          Event Finances
        </Typography>
      </Stack>

      <Typography variant="h4" gutterBottom mt={3}>
        Submitted
      </Typography>
      <FinancesTable
        events={filterEventsbyState(["submitted"])}
        role={user?.role}
      />

      <Typography variant="h4" gutterBottom>
        Pending
      </Typography>
      <FinancesTable
        events={filterEventsbyState(["not_submitted", "rejected"])}
        role={user?.role}
      />

      <Typography variant="h4" gutterBottom mt={3}>
        Accepted
      </Typography>
      <FinancesTable
        events={filterEventsbyState(["accepted"])}
        role={user?.role}
      />

    </Container>
  );
}
