import { useMutation } from "@apollo/client";
import { CREATE_MEMBER } from "gql/mutations/members";
import { GET_MEMBERS, GET_PENDING_MEMBERS } from "gql/queries/members";

import { Container } from "@mui/material";

import Page from "components/Page";
import { MemberForm } from "components/members";

export default function NewMember() {
    // default form values
    const defaultValues = {
        cid: null,
        email: null,
        poc: null,
        roles: [],
    };

    // mutation to create event
    const [createMember, { data, loading, error }] = useMutation(CREATE_MEMBER, {
        refetchQueries: [{ query: GET_MEMBERS }, { query: GET_PENDING_MEMBERS }],
    });

    return (
        <Page title={"New Member"}>
            <Container>
                <MemberForm
                    defaultValues={defaultValues}
                    submitMutation={createMember}
                    submitState={{ data, loading, error }}
                    submitButtonText="Create"
                />
            </Container>
        </Page>
    );
}
