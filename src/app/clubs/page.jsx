import { Box, Typography } from "@mui/material";

import Icon from "components/Icon";
import ClubsGrid from "components/clubs/ClubsGrid";

export const metadata = {
  title: "Clubs",
};

export default async function Clubs() {
  return (
    <Box>
      <Box mb={2} display="flex" alignItems="center">
        <Icon variant="component-exchange" mr={1} />
        <Typography variant="subtitle2" textTransform="uppercase">
          Technical Clubs
        </Typography>
      </Box>
      <ClubsGrid category="technical" />

      <Box mb={2} mt={4} display="flex" alignItems="center">
        <Icon variant="music-note-rounded" mr={1} />
        <Typography variant="subtitle2" textTransform="uppercase">
          Cultural Clubs
        </Typography>
      </Box>
      <ClubsGrid category="cultural" />

      <Box mb={2} mt={4} display="flex" alignItems="center">
        <Icon variant="psychology-rounded" mr={1} />
        <Typography variant="subtitle2" textTransform="uppercase">
          Affinity Groups
        </Typography>
      </Box>
      <ClubsGrid category="affinity" />
    </Box>
  );
}
