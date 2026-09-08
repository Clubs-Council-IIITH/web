"use client";

// import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";

import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { AchievementImage } from "components/achievements/AchievementImages";
import ButtonLink from "components/Link";
export default function ManageAchievementCard({
  _id,
  name,
  content,
  image,
  blur = 0,
  edit,
}) {
  const router = useRouter();
  return (
    <Card>
      {/* {edit &&     
        <IconButton onClick={(event)=>{
            router.push(`/manage/achievements/${_id}/edit`);
        }}>
            <EditIcon></EditIcon>
        </IconButton>} */}
      <CardActionArea
        component={ButtonLink}
        href={`/manage/achievements/${_id}`}
      >
        <Box sx={{ pt: "80%", position: "relative" }}>
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
