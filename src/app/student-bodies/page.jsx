import { Box } from "@mui/material";

import ClubsGrid from "components/clubs/ClubsGrid";

export const metadata = {
  title: "Student Bodies",
};

export default async function StudentBodies() {
  return (
    <Box>
      <ClubsGrid category="other" />
    </Box>
  );
}
