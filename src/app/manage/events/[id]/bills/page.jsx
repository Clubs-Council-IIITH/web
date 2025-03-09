import { getClient } from "gql/client";

import { redirect } from "next/navigation";

import BillUpload from "components/events/bills/BillUpload";
import { GET_EVENT_BILLS_STATUS, GET_EVENT_BUDGET } from "gql/queries/events";
import { Container, Typography } from "@mui/material";
import { GET_USER } from "gql/queries/auth";

export const metadata = {
  title: "Bill Upload | Life @ IIIT-H",
};

export default async function BillsUpload({ params }) {
  const { id } = params;

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null }
  );
  const user = { ...userMeta, ...userProfile };

  if (user.role !== "club") {
    return redirect("/404");
  }

  const { error, data = {} } = await getClient().query(GET_EVENT_BILLS_STATUS, {
    eventid: id,
  });
  if (error && error.message.includes("Event not found")) {
    return redirect("/404");
  }
  const eventBills = data?.eventBills;

  const { data: { event } = {} } = await getClient().query(GET_EVENT_BUDGET, {
    eventid: id,
  });

  if (
    !event ||
    !["rejected", "not_submitted"].includes(eventBills?.state) ||
    user?.uid !== event.clubid ||
    event.status.state !== "approved"
  ) {
    return (
      <Typography variant="h3">
        You are not allowed to upload bills for this event.
      </Typography>
    );
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Upload Bill
      </Typography>
      <BillUpload
        eventid={id}
        eventCode={event.code}
        budgetRows={event?.budget?.map((b, key) => ({
          ...b,
          id: b?.id || key,
          amountUsed: b?.amount,
        }))}
      />
    </Container>
  );
}
