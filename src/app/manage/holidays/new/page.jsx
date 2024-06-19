import { Container, Typography } from "@mui/material";

export const metadata = {
  title: "New Holiday",
};

export default async function EditHoliday() {
  // default form values
  const defaultValues = {
    name: "",
    date: null,
    description: "",
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Create a New Holiday
      </Typography>
    </Container>
  );
}
