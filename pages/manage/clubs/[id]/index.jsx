import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import { Box, Card, Container } from "@mui/material";

import { useProgressbar } from "contexts/ProgressbarContext";

import Page from "components/Page";
import ClientOnly from "components/ClientOnly";
import { ClubHero, ClubSocial } from "components/clubs";
import TextEditor from "components/TextEditor";

import ActionPalette from "components/ActionPalette";
import { editAction, deleteAction } from "components/clubs/ClubActions";

import { useQuery } from "@apollo/client";
import { GET_CLUB } from "gql/queries/clubs";

export default function Club() {
    const {
        query: { id },
    } = useRouter();

    // set title asynchronously
    const [title, setTitle] = useState("...");

    return (
        <Page title={title}>
            <Container>
                {/* details */}
                <ClientOnly>
                    <ClubDetails cid={id} setTitle={setTitle} />
                </ClientOnly>
            </Container>
        </Page>
    );
}

function ClubDetails({ cid, setTitle }) {
    const router = useRouter();
    
    const {
        data: { club } = {},
        loading,
        error,
    } = useQuery(GET_CLUB, {
        skip: !cid,
        variables: {
            clubInput: { cid: cid },
        },
        onCompleted: ({ club }) => {
            setTitle(club?.name);
        },
        onError: (error) => {
            if (error.message == "No Club Found")
                router.push(`/404`)
        },
    });

    // track loading state
    const { trackProgress } = useProgressbar();
    useEffect(() => trackProgress(loading), [loading]);

    return loading ? null : !club ? null : (
        <Box>
            {/* action palette */}
            <ActionPalette actions={[editAction, deleteAction]} />

            <Card sx={{ mb: 4, mt: 3 }}>
                <ClubHero club={club} />
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                    <TextEditor
                        editorhtmlState={[JSON.parse(club.description)?.md, null]}
                        editing={false}
                    />
                </Box>
            </Card>

            <Box mb={2}>
                <ClubSocial socials={club?.socials} />
            </Box>
        </Box>
    );
}
