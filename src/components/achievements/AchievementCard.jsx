"use client";

// import dynamic from "next/dynamic";

import { Box, Card, CardActionArea, Stack, Typography } from "@mui/material";

import { AchievementImage } from "components/achievements/AchievementImages";
import ButtonLink from "components/Link";

// const DateTime = dynamic(() => import("components/DateTime"), { ssr: false });

export default function AchievementCard({
  _id,
  name,
  content,
  image,
  blur = 0,
}) {
  return (
    <Card>
      <CardActionArea component={ButtonLink} href={`/achievements/${_id}`}>
        <Box sx={{ pt: "100%", position: "relative" }}>
          <AchievementImage
            name={name}
            image={image}
            width={600}
            height={600}
            style={{
              filter: `blur(${blur}em)`,
            }}
          />
        </Box>

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              fontSize: 16,
            }}
          >
            {name}
          </Typography>
          <Typography variant="caption" noWrap>
            {content}
          </Typography>
          {/* <Typography variant="caption" noWrap>
            <DateTime dt={datetimeperiod?.[0]} showWeekDay={true} />
          </Typography> */}
        </Stack>
      </CardActionArea>
    </Card>
  );
}
