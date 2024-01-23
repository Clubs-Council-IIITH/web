import Link from "next/link";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import ClubBanner from "components/clubs/ClubBanner";
import ClubLogo from "components/clubs/ClubLogo";

export default function ClubCard({
  dim,
  cid,
  banner,
  name,
  logo,
  tagline,
  studentBody,
  url = null,
}) {
  return (
    <Card variant="outlined" sx={{ position: "relative" }}>
      <CardActionArea
        component={Link}
        href={
          url ? url : studentBody ? `/student-bodies/${cid}` : `/clubs/${cid}`
        }
      >
        <Box backgroundColor="black" borderRadius={2}>
          <ClubBanner
            dim={dim}
            name={name}
            banner={banner}
            width={640}
            height={480}
            containerHeight="100%"
          />
        </Box>
        <CardContent
          sx={{ pt: 4, bottom: 0, width: "100%", position: "absolute" }}
        >
          <ClubLogo
            name={name}
            logo={logo}
            width={64}
            height={64}
            border={3}
            mb={2}
          />
          <Typography variant="h5" underline="none" color="common.white">
            {name}
          </Typography>

          <Typography
            variant="caption"
            component="div"
            mt={1}
            sx={{
              color: "text.disabled",
              display: "block",
              fontSize: 14,
              mixBlendMode: "lighten",
            }}
          >
            {tagline}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
