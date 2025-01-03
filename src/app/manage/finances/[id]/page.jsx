import { getClient } from "gql/client";
import { GET_EVENT_BILLS_STATUS } from "gql/queries/events";
import Link from "next/link";

import { Button, Container, Stack, Typography } from "@mui/material";

import BillsStatusForm from "components/events/bills/EditBillsStatus";

export const metadata = {
  title: "Edit Bill Status",
};

export default async function EditFinance({ params }) {
  const { id } = params;

  const { data, error } = await getClient().query(GET_EVENT_BILLS_STATUS, {
    eventid: id,
  });

  if (error && !error.message.includes("no bills status")) {
    return (
      <Container>
        <Typography variant="h4" align="center" mt={5} px={2}>
          Error: {error.message.slice(10)}
        </Typography>
        <Stack direction="column" alignItems="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href={`/manage/finances`}
          >
            <Typography variant="button" color="opposite">
              Go Back
            </Typography>
          </Button>
        </Stack>
      </Container>
    );
  }

  const defaultValues = {
    state: null,
    sloComment: null,
  };

  const eventBills = data?.eventBills || defaultValues;

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h3" gutterBottom>
          Edit Bill Status Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href={`/manage/events/${id}`}
        >
          <Typography variant="button" color="opposite">
            View Event
          </Typography>
        </Button>
      </Stack>
      <BillsStatusForm id={id} defaultValues={eventBills} />
    </Container>
  );
}
