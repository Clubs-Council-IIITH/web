import { Button, Container, Stack, Typography } from "@mui/material";

import { getClient } from "gql/client";
import {
  GET_ACHIEVEMENT_BY_CLUB,
  GET_ALL_ACHIEVEMENTS,
} from "gql/queries/achievements";
import { GET_USER } from "gql/queries/auth";

import ManageAchievementsGrid from "components/achievements/ManageAchievementGrid";
import Icon from "components/Icon";
import ButtonLink from "components/Link";

export const metadata = {
  title: "Manage Achievements",
};

export default async function ManageAchievements() {
  const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
    userInput: null,
  });
  let achievements = [];

  if (userMeta?.role === "club") {
    const { data } = await getClient().query(GET_ACHIEVEMENT_BY_CLUB, {
      cid: userMeta.uid,
    });
    achievements = data?.achievementsByClub ?? [];
  } else {
    const { data } = await getClient().query(GET_ALL_ACHIEVEMENTS);
    achievements = data?.allAchievements ?? [];
  }
  const isApprover = userMeta?.role === "slo" || userMeta?.role === "cc";
  const pendingAchievements = isApprover
    ? achievements.filter(
        (achievement) => achievement?.status?.state === "pending",
      )
    : [];

  // console.log("ACHIEVEMENTS: ", achievements);

  const edit = isApprover;

  return (
    <Container>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Manage Achievements
        </Typography>

        <Button
          component={ButtonLink}
          href="/manage/achievements/new"
          variant="contained"
          startIcon={<Icon variant="add" />}
        >
          New achievements
        </Button>
      </Stack>

      {isApprover && (
        <Container disableGutters sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Achievements to be approved
          </Typography>
          <ManageAchievementsGrid
            type="recent"
            achievements={pendingAchievements}
            edit={edit}
          />
        </Container>
      )}

      <Typography variant="h4" gutterBottom>
        All achievements
      </Typography>
      <ManageAchievementsGrid
        type="recent"
        achievements={achievements}
        edit={edit}
      />
    </Container>
  );
}
