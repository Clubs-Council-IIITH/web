import { getClient } from "gql/client";
import { GET_FULL_EVENT } from "gql/queries/events";
import { redirect } from "next/navigation";
import { GET_USER } from "gql/queries/auth";

import { Container, Typography } from "@mui/material";

import EventForm from "components/events/EventForm";

export const metadata = {
  title: "Edit Event",
};

function transformEvent(event) {
  return {
    ...event,
    // parse datetime strings to date objects
    datetimeperiod: [
      new Date(event?.datetimeperiod[0]),
      new Date(event?.datetimeperiod[1]),
    ],
    // add mandatory ID field for DataGrid
    budget:
      event?.budget?.map((budget, key) => ({
        ...budget,
        id: budget?.id || key,
      })) || [],
    // parse population as int
    population: parseInt(event?.population || 0),
    // default fallbacks for text fields
    additional: event?.additional || "",
    equipment: event?.equipment || "",
    poc: event?.poc,
  };
}

export default async function EditEvent({ params }) {
  const { id } = params;
  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = { ...userMeta, ...userProfile };

  try {
    const { data: { event } = {} } = await getClient().query(GET_FULL_EVENT, {
      eventid: id,
    });
    return (
      user?.uid !== event.clubid && redirect("/404"),
      (
        <Container>
          <Typography variant="h3" gutterBottom mb={3}>
            Edit Event Details
          </Typography>

          <EventForm
            id={id}
            defaultValues={transformEvent(event)}
            action="edit"
          />
        </Container>
      )
    );
  } catch (error) {
    redirect("/404");
  }
}
