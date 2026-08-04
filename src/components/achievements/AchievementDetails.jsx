import dayjs from "dayjs";

import { Box, Card, Grid, Stack, Typography} from "@mui/material";
import Link from "next/link";

import UsersTable from "components/achievements/UsersTable"
import ClubButton from "components/clubs/ClubButton";
import AchievementImages from "./AchievementImages";
import Icon from "components/Icon";

export default function AchievementDetails({ achievement, showCode = false }) {
  return (
    <Grid container spacing={2}>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <Card variant="outlined"> 
          <AchievementImages achievement={achievement} />
        </Card>
      </Grid> 
      <Grid
        size={{
          xs: "grow",
          md: "grow",
        }}
      >
        <Stack
          direction="column"
          sx={{
            p: 1,
          }}
        >
          <Typography
            variant="h3"
            paragraph
            sx={{
              mt: 1,
              mb: 0,
            }}
          >
            {achievement.name}
          </Typography>
          <Box
            sx={{
              my: 1,
            }}
          />
          <Typography
            variant="h6"
            paragraph
            sx={{
              mt: 1,
              mb: 0,
            }}
          >
            {achievement.achievementType}
          </Typography>
          <Box
            sx={{
              my: 1,
            }}
          />
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Icon variant="calendar-today" sx={{ mr: 2, width: 16 }} />
            <Typography variant="body2">
              {dayjs(achievement.dateperiod[0]).format("DD MMM YYYY")}
            </Typography>
            <Box
              sx={{
                mx: 1,
              }}
            >
              -
            </Box>
            <Typography variant="body2">
              {dayjs(achievement.dateperiod[1]).format("DD MMM YYYY")}
            </Typography>
          </Box>
          <Box
            sx={{
              my: 1,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {achievement.clubids.map((clubid) => (
              <ClubButton clubid={clubid} key={clubid} />
            ))}
          </Box>
          <Box
            sx={{
              my: 1,
            }}
          />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Links
            </Typography>
            {achievement.blogLinks.map((link) => (
              <Link key={link} href={link}>
                {link}
              </Link>
            ))}
          <Box
            sx={{
              my: 1,
            }}
          />
          <Typography variant="body" sx={{ whiteSpace: "pre-wrap" }}>
            {achievement.content || "No description available."}
          </Typography>
          <Box
            sx={{
              my: 1,
            }}
          />
          <UsersTable achievement={achievement} />
        </Stack>
      </Grid>
    </Grid> 
  );  
}