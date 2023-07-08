import { useMutation } from "@apollo/client";
import { CREATE_EVENT } from "gql/mutations/events";
import { GET_ALL_EVENTS, GET_CLUB_EVENTS } from "gql/queries/events";

import { useAuth } from "contexts/AuthContext";
import { Container } from "@mui/material";

import Page from "components/Page";
import { EventForm } from "components/events";

export default function NewEvent() {
  // default form values
  const defaultValues = {
    clubid: null,
    name: null,
    datetimeperiod: [null, null],
    description: null,
    audience: [],
    poster: null,
    budget: [],
    mode: "offline",
    link: null,
    location: [],
    population: 0,
    additional: null,
    equipment: null,
  };

  const { user } = useAuth();

  // mutation to create event
  const [createEvent, { data, loading, error }] = useMutation(CREATE_EVENT, {
    refetchQueries: [
      { query: GET_CLUB_EVENTS, variables: { clubid: user?.uid, clubInput: { cid: user?.uid } } },
      { query: GET_ALL_EVENTS, variables: { clubid: user?.uid } },
    ],
  });

  return (
    <Page title={"New Event"}>
      <Container>
        <EventForm
          defaultValues={defaultValues}
          submitMutation={createEvent}
          submitState={{ data, loading, error }}
          submitButtonText="Create"
        />
      </Container>
    </Page>
  );
}
