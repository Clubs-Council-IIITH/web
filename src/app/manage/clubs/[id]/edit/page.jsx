import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_USER } from "gql/queries/auth";
import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import ClubForm from "components/clubs/ClubForm";

export const metadata = {
  title: "Edit Club",
};

export default async function EditClub({ params }) {
  const { id } = params;

  try {
    const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
      userInput: null,
    });

    const { data: { club } = {} } = await getClient().query(GET_CLUB, {
      clubInput: {
        cid: id === encodeURIComponent("~mine") ? userMeta.uid : id,
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
  } catch (error) {
    redirect("/404");
  }
}
