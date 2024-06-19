import { getClient } from "gql/client";
import { GET_HOLIDAY } from "gql/queries/holidays";
import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

export const metadata = {
  title: "Edit Holiday",
};

export default async function EditHoliday({ params }) {
  const { id } = params;

  try {
    const { data: { holiday } = {} } = await getClient().query(GET_HOLIDAY, {
      id: id,
    });

    return (
      <Container>
        <Typography variant="h3" gutterBottom mb={3}>
          Edit Holiday Details
        </Typography>
      </Container>
    );
  } catch (error) {
    return redirect("/404");
  }
}
