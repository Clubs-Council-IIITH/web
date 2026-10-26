import { Box, Button, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_ACHIEVEMENT_BY_CLUB } from "gql/queries/achievements";

import Icon from "components/Icon";
import ButtonLink from "components/Link";

import AchievementCards from "./AchievementCards";

export default async function AchievementsGrid({
  type = "recent", // must be one of: {recent, club}
  cid = null,
  limit = undefined,
  achievements = null,
  clubid,
}) {
  console.log("AchievementsGrid rendered");
  if (type === "club" && !cid) {
    console.log("cid:", cid);
    throw new Error('clubid is required when type is "club"');
  } else if (type === "recent" && cid) {
    cid = null;
  }

  let data;
  if (achievements) {
    data = { data: { achievements } };
  } else {
    data = await getClient().query(GET_ACHIEVEMENT_BY_CLUB, {
      cid,
      limit: limit || 12,
    });
  }

  const achievementList =
    data?.data?.achievementsByClub ?? data?.data?.achievements ?? [];

  if (!achievementList.length) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon variant="local-activity-outline-rounded" sx={{ mr: 1 }} />
          <Typography variant="h4">Achievements</Typography>
        </Box>
        <Button
          variant="none"
          color="secondary"
          component={ButtonLink}
          href={`/achievements?club=${clubid}`}
        >
          <Typography
            variant="button"
            sx={{
              color: "text.primary",
            }}
          >
            View all
          </Typography>
          <Icon variant="chevron-right" />
        </Button>
      </Box>
      <AchievementCards
        achievements={achievementList.slice(0, limit)}
        loading={false}
        noAchievementsMessage="No achievements found."
      />
    </>
  );
}
