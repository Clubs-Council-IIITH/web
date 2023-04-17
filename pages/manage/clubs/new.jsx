import { useMutation } from "@apollo/client";
import { CREATE_CLUB } from "gql/mutations/clubs";

import { Container } from "@mui/material";

import Page from "components/Page";
import { ClubForm } from "components/clubs";

export default function NewClub() {
    // default form values
    const defaultValues = {
        cid: null,
        name: null,
        email: null,
        category: "cultural",
        tagline: null,
        description: null,
        socials: {
            website: null,
            instagram: null,
            facebook: null,
            youtube: null,
            twitter: null,
            linkedin: null,
            discord: null,
        },
        logo: null,
        banner: null,
    };

    // mutation to create club
    const [createClub, { data, loading, error }] = useMutation(CREATE_CLUB);

    return (
        <Page title={"New Club"}>
            <Container>
                <ClubForm
                    defaultValues={defaultValues}
                    submitMutation={createClub}
                    submitState={{ data, loading, error }}
                    submitButtonText="Create"
                />
            </Container>
        </Page>
    );
}
