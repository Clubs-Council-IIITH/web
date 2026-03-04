import { notFound } from "next/navigation";

import { Container, Typography } from "@mui/material";

import { getClient, combineQuery } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_CLUB } from "gql/queries/clubs";

import ClubForm from "components/clubs/ClubForm";

export const metadata = {
  title: "Edit Club",
};

export default async function EditClub(props) {
  const params = await props.params;
  const { id } = params;

  let userMeta, club;

  try {
    const { document, variables } = combineQuery('CombinedQuery')
      .add(GET_USER, {
        userInput: null
      });

    const { data: { userMeta: fetchedUserMeta } = {} } = await getClient().query(document, variables);
    userMeta = fetchedUserMeta;

    const { document: curDocument, variables: curVariables } = combineQuery('CombinedQuery')
      .add(GET_CLUB,
        {
          clubInput: {
            cid: id === encodeURIComponent("~mine") ? userMeta.uid : id,
          },
        });

    const { data: { club: fetchedClub } = {} } = await getClient().query(curDocument, curVariables);

    club = fetchedClub;
  } catch (error) {
    notFound();
  }

  return (
    <Container>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          mb: 3,
        }}
      >
        Edit Club Details
      </Typography>
      <ClubForm defaultValues={club} action="edit" />
    </Container>
  );
}
