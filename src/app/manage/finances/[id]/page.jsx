import { getClient } from "gql/client";
import { GET_EVENT_BILLS_STATUS } from "gql/queries/events";
import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import BillsStatusForm from "components/events/EditBillsStatus";

export const metadata = {
  title: "Edit Bill Status",
};

export default async function EditHoliday({ params }) {
  const { id } = params;

  try {
    const { data, error } = await getClient().query(GET_EVENT_BILLS_STATUS, {
      eventid: id,
    });

    if (error || !data) return redirect("/404");

    const eventBills = data?.eventBills;

    return (
      <Container>
        <Typography variant="h3" gutterBottom mb={3}>
          Edit Bill Status Details
        </Typography>

        <BillsStatusForm id={id} defaultValues={eventBills} />
      </Container>
    );
  } catch (error) {
    return redirect("/404");
  }
}
