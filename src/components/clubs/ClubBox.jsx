import Link from "next/link";

import { Box, Button, Typography } from "@mui/material";

import ClubLogo from "components/clubs/ClubLogo";

export default async function ClubBox({ club }) {
    if (!club) return null;

  return (
    <Box>
      <Button
        component={Link}
        href={`/clubs/${club.cid}`}
        variant="outlined"
        color="secondary"
        display="flex"
        alignItems="center"
      >
        <ClubLogo
          name={club.name}
          logo={club.logo}
          width={18}
          height={18}
          mr={1}
          style={{
            border: '2px solid lightgray'
          }}
        />
        <Typography variant="body2" color="text.primary">
          {club.name}
        </Typography>
      </Button>
    </Box>
  );
}
