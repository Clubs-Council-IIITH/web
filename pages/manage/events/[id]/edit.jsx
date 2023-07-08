import { useState } from "react";

import { useRouter } from "next/router";

import { useQuery, useMutation } from "@apollo/client";
import { EDIT_EVENT } from "gql/mutations/events";
import { GET_FULL_EVENT, GET_ALL_EVENTS } from "gql/queries/events";

import { Container } from "@mui/material";

import Page from "components/Page";
import { EventForm } from "components/events";

export default function EditEvent() {
  const { query } = useRouter();
  const { id: eid } = query;

  // default form values
  const [defaultValues, setDefaultValues] = useState({
    eventid: eid,
    clubid: null,
    name: null,
    datetimeperiod: [null, null],
    description: null,
    audience: [],
    poster: null,
    budget: [],
    mode: "hybrid",
    link: null,
    location: [],
    population: 0,
    additional: null,
    equipment: null,
  });

  // query to get event details
  const {
    data: { event } = {},
    loading: eventLoading,
    error: eventError,
  } = useQuery(GET_FULL_EVENT, {
    skip: !eid,
    variables: {
      eventid: eid,
    },
    onCompleted: ({ event }) => {
      setDefaultValues({
        eventid: eid,
        clubid: event?.clubid,
        name: event?.name,
        datetimeperiod: event?.datetimeperiod?.map((d) => new Date(d)),
        description: event?.description,
        audience: event?.audience,
        poster: event?.poster,
        budget: event?.budget?.map((b, key) => ({ ...b, id: b?.id || key })), // add ID to each budget item if it doesn't exist (MUI requirement)
        mode: event?.mode,
        link: event?.link,
        location: event?.location,
        population: event?.population,
        additional: event?.additional,
        equipment: event?.equipment,
      });
    },
  });

  // mutation to update event
  const [editEvent, { data, loading, error }] = useMutation(EDIT_EVENT, {
    refetchQueries: [
      { query: GET_ALL_EVENTS },
      { query: GET_FULL_EVENT, variables: { eventid: eid } },
    ],
  });

  return eventLoading ? null : !event ? null : (
    <Page title={"Edit Event"}>
      <Container>
        <EventForm
          defaultValues={defaultValues}
          submitMutation={editEvent}
          submitState={{ data, loading, error }}
          submitButtonText="Save"
        />
      </Container>
    </Page>
  );
}
