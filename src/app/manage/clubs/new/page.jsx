import { Container, Typography } from "@mui/material";

import ClubForm from "components/clubs/ClubForm";

export const metadata = {
  title: "New Club",
};

export default function NewClub() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Create a New Club
      </Typography>

      <ClubForm defaultValues={{}} action="create" />
    </Container>
  );
}
