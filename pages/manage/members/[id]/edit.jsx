import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import { useQuery, useMutation } from "@apollo/client";
import { EDIT_MEMBER } from "gql/mutations/members";
import { GET_MEMBER, GET_MEMBERS, GET_PENDING_MEMBERS } from "gql/queries/members";

import { Container } from "@mui/material";

import Page from "components/Page";
import { MemberForm } from "components/members";

export default function EditEvent() {
    const { query } = useRouter();
    const { id } = query;

    // default form values
    const [defaultValues, setDefaultValues] = useState({
        email: null,
        cid: null,
        poc: false
    });

    const [roles, setRoles] = useState([]);
    const [queryloading, setQueryLoading] = useState(true);

    // query to get event details
    const {
        loading: memberLoading,
        error: memberError,
        data: { member, userProfile } = {},
    } = useQuery(GET_MEMBER, {
        skip: !id,
        variables: {
            memberInput: {
                cid: id?.split(":")[0],
                uid: id?.split(":")[1],
                rid: null,
            },
            userInput: {
                uid: id?.split(":")[1],
            },
        },
        onCompleted: ({ member, userProfile }) => {
            setDefaultValues({
                email: userProfile?.email,
                cid: member?.cid,
                poc: member?.poc
            });
        },
    });

    useEffect(() => {
        if (!memberLoading) {
            member?.roles?.forEach((role, i) => {
                setRoles([...roles, {
                    id: i,
                    name: role?.name,
                    startYear: role?.startYear,
                    endYear: role?.endYear,
                }]);
            });
            setQueryLoading(false);
        }
    }, [member]);

    // mutation to update event
    const [editMember, { data, loading, error }] = useMutation(EDIT_MEMBER, {
        refetchQueries: [
            { query: GET_MEMBERS },
            { query: GET_PENDING_MEMBERS },
        ],
    });

    return queryloading || memberLoading ? null : !member ? null : (
        <Page title={"Edit Member"}>
            <Container>
                <MemberForm
                    defaultValues={defaultValues}
                    submitMutation={editMember}
                    submitState={{ data, loading, error }}
                    submitButtonText="Save"
                    defaultRoles={roles}
                />
            </Container>
        </Page>
    );
}
