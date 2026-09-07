import { Box } from "@mui/material";

import ClubsGrid from "components/clubs/ClubsGrid";
import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Supervisory Bodies @ IIIT-H",
};

export default async function SupervisoryBodies() {
  return (
    <Box>
      <ClubsGrid category="supervisory" />
    </Box>
  );
}
