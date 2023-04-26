import { useMutation } from "@apollo/client";
// import { CREATE_EVENT } from "gql/mutations/events";

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

        mode: 0,
        link: null,
        location: [],
        population: null,
        additional: null,
        equipment: null,
    };

    // mutation to create event
    // const [createClub, { data, loading, error }] = useMutation(CREATE_CLUB, {
    //     // refetchQueries: [{ query: GET_ACTIVE_CLUBS }, { query: GET_ALL_CLUBS }],
    // });

    return (
        <Page title={"New Event"}>
            <Container>
                <EventForm
                    defaultValues={defaultValues}
                    // submitMutation={createEvent}
                    // submitState={{ data, loading, error }}
                    submitButtonText="Create"
                />
            </Container>
        </Page>
    );
}
