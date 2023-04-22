import { useState } from "react";

import { useRouter } from "next/router";

import { useQuery, useMutation } from "@apollo/client";
import { EDIT_CLUB } from "gql/mutations/clubs";
import { GET_ACTIVE_CLUBS, GET_ALL_CLUBS, GET_CLUB } from "gql/queries/clubs";

import { Container } from "@mui/material";

import Page from "components/Page";
import { ClubForm } from "components/clubs";

export default function EditClub() {
    const { query } = useRouter();
    const { id: cid } = query;

    // default form values
    const [defaultValues, setDefaultValues] = useState({
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
    });

    // query to get club details
    const {
        data: { club } = {},
        loading: clubLoading,
        error: clubError,
    } = useQuery(GET_CLUB, {
        variables: {
            clubInput: { cid: cid },
        },
        onCompleted: ({ club }) => {
            setDefaultValues({
                cid: club?.cid,
                name: club?.name,
                email: club?.email,
                category: club?.category,
                tagline: club?.tagline,
                description: JSON.parse(club?.description || {}),
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
        refetchQueries: [{ query: GET_ACTIVE_CLUBS }, { query: GET_ALL_CLUBS }],
    });

    return clubLoading ? null : !club ? null : (
        <Page title={"Edit Club"}>
            <Container>
                <ClubForm
                    disableRequiredFields={true} // TODO: true if current user is the club, false if current user is cc
                    defaultValues={defaultValues}
                    submitMutation={editClub}
                    submitState={editClubState}
                    submitButtonText="Save"
                />
            </Container>
        </Page>
    );
}
