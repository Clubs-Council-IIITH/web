import { Box, Typography } from "@mui/material";

import ClubsGrid from "components/clubs/ClubsGrid";
import Icon from "components/Icon";

import { clubCategories } from "constants/clubCategories";

export const metadata = {
  title: "Clubs @ IIIT-H",
};

export default async function Clubs() {
  return (
    <>
      { clubCategories.map((category, index) => {
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
            <ClubsGrid category={category}/>
          </Box>
        )
      }) }
    </>
  );
}
