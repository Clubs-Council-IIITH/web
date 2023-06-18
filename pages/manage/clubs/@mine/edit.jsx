import { useState } from "react";

import { useQuery, useMutation } from "@apollo/client";
import { EDIT_CLUB } from "gql/mutations/clubs";
import { GET_ACTIVE_CLUBS, GET_ALL_CLUBS, GET_CLUB } from "gql/queries/clubs";

import { Container } from "@mui/material";

import { useAuth } from "contexts/AuthContext";

import Page from "components/Page";
import { ClubForm } from "components/clubs";

export default function EditClub() {
    const { user } = useAuth();

    // default form values
    const [defaultValues, setDefaultValues] = useState({
        cid: null,
        code: null,
        name: null,
        email: null,
        category: "cultural",
        tagline: null,
        description: { "md": "", "html": "" },
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
    });

    // query to get club details
    const {
        data: { club } = {},
        loading: clubLoading,
        error: clubError,
    } = useQuery(GET_CLUB, {
        skip: !user?.uid,
        variables: {
            clubInput: { cid: user?.uid },
        },
        onCompleted: ({ club }) => {
            setDefaultValues({
                cid: user?.uid,
                code: club?.code,
                name: club?.name,
                email: club?.email,
                category: club?.category,
                studentBody: club?.studentBody,
                tagline: club?.tagline,
                description: JSON.parse(club?.description || {"md":"","html":""}),
                socials: {
                    website: club?.socials?.website,
                    instagram: club?.socials?.instagram,
                    facebook: club?.socials?.facebook,
                    youtube: club?.socials?.youtube,
                    twitter: club?.socials?.twitter,
                    linkedin: club?.socials?.linkedin,
                    discord: club?.socials?.discord,
                },
                logo: club?.logo,
                banner: club?.banner,
            });
        },
    });

    // mutation to create club
    const [editClub, editClubState] = useMutation(EDIT_CLUB, {
        refetchQueries: [{ query: GET_ACTIVE_CLUBS }, { query: GET_ALL_CLUBS }, { query: GET_CLUB, variables: { clubInput: { cid: user?.uid } } }],
    });

    return clubLoading ? null : !club ? null : (
        <Page title={"Edit Club"}>
            <Container>
                <ClubForm
                    disableRequiredFields={true} // true if current user is the club
                    defaultValues={defaultValues}
                    submitMutation={editClub}
                    submitState={editClubState}
                    submitButtonText="Save"
                    disableClubCode={true}
                />
            </Container>
        </Page>
    );
}
