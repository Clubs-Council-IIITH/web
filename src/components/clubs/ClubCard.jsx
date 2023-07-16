import Link from "next/link";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import ClubBanner from "components/clubs/ClubBanner";

export default function ClubCard({
  cid,
  banner,
  name,
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
        <Box
          sx={{
            position: "relative",
            paddingTop: "calc(100% * 3 / 4)",
            pt: "100%",
            "&:after": {
              top: 0,
              content: "''",
              width: "100%",
              height: "100%",
              position: "absolute",
            },
          }}
        >
          <ClubBanner
            name={name}
            banner={banner}
            width={640}
            height={480}
            style={{
              top: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          />
        </Box>
        <CardContent
          sx={{ pt: 4, bottom: 0, width: "100%", position: "absolute" }}
        >
          <Typography variant="h5" underline="none" color="common.white">
            {name}
          </Typography>

          <Typography
            variant="caption"
            component="div"
            sx={{
              color: "text.disabled",
              display: "block",
              fontSize: 14,
              mixBlendMode: "difference",
            }}
          >
            {tagline}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
