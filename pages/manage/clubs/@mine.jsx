import { useState } from "react";

import { useRouter } from "next/router";

import { Box, Card, Container } from "@mui/material";

import { useAuth } from "contexts/AuthContext";

import Page from "components/Page";
import ClientOnly from "components/ClientOnly";
import { ClubHero } from "components/clubs";
import { RichTextEditor } from "components/RichTextEditor";

import ActionPalette from "components/ActionPalette";
import { editAction } from "components/clubs/ClubActions";

import { useQuery } from "@apollo/client";
import { GET_CLUB } from "gql/queries/clubs";

export default function Club() {
    // set title asynchronously
    const [title, setTitle] = useState("...");

    return (
        <Page title={title}>
            <Container>
                {/* details */}
                <ClientOnly>
                    <ClubDetails setTitle={setTitle} />
                </ClientOnly>
            </Container>
        </Page>
    );
}

function ClubDetails({ cid, setTitle }) {
    const { user } = useAuth();

    const {
        data: { club } = {},
        loading,
        error,
    } = useQuery(GET_CLUB, {
        skip: !user?.uid,
        variables: {
            clubInput: { cid: user?.uid },
        },
        onCompleted: ({ club }) => {
            setTitle(club?.name);
        },
    });

    // TODO: handle loading screen and non-existent club
    return loading ? null : !club ? null : (
        <Box>
            {/* action palette */}
            <ActionPalette actions={[editAction]} />

            <Card sx={{ mb: 4, mt: 3 }}>
                <ClubHero club={club} />
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                    <RichTextEditor
                        editing={false}
                        editorState={[JSON.parse(club.description), null]}
                    />
                </Box>
            </Card>
        </Box>
    );
}
