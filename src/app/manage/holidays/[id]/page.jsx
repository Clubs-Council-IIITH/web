import { getClient } from "gql/client";
import { GET_HOLIDAY } from "gql/queries/holidays";
import { notFound } from "next/navigation";

import HolidayForm from "components/holidays/HolidayForm";

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

        <HolidayForm id={id} defaultValues={holiday} action="edit" />
      </Container>
    );
  } catch (error) {
    notFound();
  }
}
