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
        <ClubBanner
          name={name}
          banner={banner}
          width={640}
          height={480}
          containerHeight="100%"
        />
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
