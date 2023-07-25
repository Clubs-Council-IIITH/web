import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";

import { Container, Typography } from "@mui/material";

import ClubForm from "components/clubs/ClubForm";

export const metadata = {
  title: "Edit Club",
};

export default async function EditClub({ params }) {
  const { id } = params;

  const { data: { club } = {} } = await getClient().query({
    query: GET_CLUB,
    variables: {
      clubInput: { cid: id },
    },
  });

  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Edit Club Details
      </Typography>

      <ClubForm defaultValues={club} action="edit" />
    </Container>
  );
}
