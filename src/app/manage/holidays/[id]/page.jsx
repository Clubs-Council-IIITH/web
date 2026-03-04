import { notFound } from "next/navigation";

import { Container, Typography } from "@mui/material";

import { getClient, combineQuery } from "gql/client";

import { GET_HOLIDAY } from "gql/queries/holidays";

import HolidayForm from "components/holidays/HolidayForm";

export const metadata = {
  title: "Edit Holiday",
};

export default async function EditHoliday(props) {
  const params = await props.params;
  const { id } = params;

  let holiday;

  try {
    const { document, variables } = combineQuery('CombinedQuery')
      .add(GET_HOLIDAY,
        {
          id: id,
        });

    const { data: { holiday: fetchedHoliday } = {} } = await getClient().query(document, variables);
    holiday = fetchedHoliday;

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
        Edit Holiday Details
      </Typography>
      <HolidayForm id={id} defaultValues={holiday} action="edit" />
    </Container>
  );
}
