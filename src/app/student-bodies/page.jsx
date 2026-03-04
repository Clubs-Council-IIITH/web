import { Box } from "@mui/material";

import ClubsGrid from "components/clubs/ClubsGrid";
import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Student Bodies @ IIIT-H",
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function StudentBodies() {
  const cc = {
    cid: "clubs",
    name: "Clubs Council",
    logo: getStaticFile("cc-logo.png"),
    banner: getStaticFile("cc-banner.png"),
    tagline: "Let's make college life fun!",
    category: "body",
  };

  return (
    <Box>
      <ClubsGrid category="body" staticClubs={[cc]} />
    </Box>
  );
}
