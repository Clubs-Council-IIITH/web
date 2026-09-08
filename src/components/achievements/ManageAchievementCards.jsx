import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import ManageAchievementCard from "components/achievements/ManageAchievementCard";
export default function ManageAchievementCards({ achievements, loading, noAchievementsMessage, edit }) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          mt: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {achievements?.length ? (
        achievements.map((achievement) => (
          <Grid
            key={achievement._id}
            size={{
              xs: 6,
              md: 4,
              lg: 3,
            }}
          >
            <ManageAchievementCard
              _id={achievement._id}
              name={achievement.name}
              image={achievement.imageLinks?.[0]}
              content={achievement.content}
              blur={achievement.imageLinks?.[0] ? 0 : 0.3}
              edit={edit}
            />
          </Grid>
        ))
      ) : (
        <Typography
          variant="h4"
          sx={{
            color: "text.secondary",
            flexGrow: 1,
            textAlign: "center",
            mt: 5,
          }}
        >
          {noAchievementsMessage}
        </Typography>
      )}
    </Grid>
  );
}

