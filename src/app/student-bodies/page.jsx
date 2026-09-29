import { Box, Typography } from "@mui/material";

import ClubsGrid from "components/clubs/ClubsGrid";
import Icon from "components/Icon";
import { getStaticFile } from "utils/files";

import { studentBodyCategories } from "constants/clubCategories";

export const metadata = {
  title: "Student Bodies @ IIIT-H",
};

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
    <>
      { studentBodyCategories.map((category, index) => {
        return (
          <Box key={category} sx={{mx: 5}}>
            <Box
              sx={{
                mb: 2,
                mt: index != 0 ? 5: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Icon variant="component-exchange" sx={{ mr: 1 }} />
              <Typography
                variant="subtitle2"
                sx={{
                  textTransform: "uppercase",
                }}
              >
                {category}
              </Typography>
            </Box>
            <ClubsGrid category={category} staticClubs={[cc]} />
          </Box>
        )
      }) }
    </>
  )
}
