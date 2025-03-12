import { getClient } from "gql/client";
import { GET_EVENT_BILLS_STATUS, GET_EVENT_BUDGET } from "gql/queries/events";
import Link from "next/link";

import { Button, Container, Stack, Typography, Box } from "@mui/material";

import BillsStatusForm from "components/events/bills/EditBillsStatus";
import FinanceHeader from "components/events/bills/FinanceHeader";
import { redirect } from "next/navigation";
import EventBudget from "../../../../components/events/EventBudget";

export const metadata = {
  title: "Edit Bill Status",
};

export default async function EditFinance({ params }) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query(GET_EVENT_BUDGET, {
    eventid: id,
  });

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

  if (eventBills.state === "not_submitted" || eventBills.state === "rejected") {
    redirect("/404");
  }

  return (
    <Container>
      {eventBills.state === "submitted" ? (
        <FinanceHeader
          id={id}
          eventTitle={event.name}
          filename={eventBills?.filename}
        />
      ) : null}
      <Box mb={5}>
        <BillsStatusForm id={id} defaultValues={eventBills} />
      </Box>
      <EventBudget
        rows={event?.budget?.map((b, key) => ({
          ...b,
          id: b?.id || key,
        }))} // add ID to each budget item if it doesn't exist (MUI requirement)
        editable={false}
        billViewable={true}
      />
    </Container>
  );
}
