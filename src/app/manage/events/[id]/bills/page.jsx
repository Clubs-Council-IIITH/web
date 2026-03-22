import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import { getClient, combineQuery } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_EVENT_BILLS_STATUS, GET_EVENT_BUDGET } from "gql/queries/events";

import BillUpload from "components/events/bills/BillUpload";

export const metadata = {
  title: "Bill Upload | Life @ IIIT-H",
};

export default async function BillsUpload(props) {
  const params = await props.params;
  const { id } = params;

  const { document, variables } = combineQuery("CombinedBillsQuery")
    .add(GET_USER, { userInput: null })
    .add(GET_EVENT_BILLS_STATUS, { eventid: id })
    .add(GET_EVENT_BUDGET, { eventid: id });

  const { data = {}, error } = await getClient().query(document, variables);
  const { userMeta, userProfile, eventBills, event } = data;
  const user = { ...userMeta, ...userProfile };

  if (error && error.message.includes("Event not found")) {
    return redirect("/404");
  }

  if (user.role !== "club") {
    return redirect("/404");
  }

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
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          mb: 3,
        }}
      >
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
