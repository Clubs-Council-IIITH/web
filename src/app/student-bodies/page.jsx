import { Box } from "@mui/material";

import ClubsGrid from "components/clubs/ClubsGrid";
import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Student Bodies",
};

export default async function StudentBodies() {
  const cc = {
    cid: "clubs",
    name: "Clubs Council",
    logo: getStaticFile("img/cc-logo.png"),
    banner: getStaticFile("img/cc-banner.png"),
    tagline: "Let's make college life fun!",
    studentBody: true,
    category: "other",
  };

  return (
    <Box>
      <ClubsGrid category="other" studentBody={true} staticClubs={[cc]} />
    </Box>
  );
}
