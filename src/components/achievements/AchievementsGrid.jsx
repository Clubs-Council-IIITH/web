import { getClient } from "gql/client";
import { GET_ACHIEVEMENT_BY_CLUB } from "gql/queries/achievements";

import AchievementCards from "./AchievementCards";

export default async function AchievementsGrid({
  type = "recent", // must be one of: {recent, club}
  cid = null,
  limit = undefined,
  achievements = null,
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

  return (
    <AchievementCards
      achievements={data.data.achievementsByClub}
      loading={false}
      noAchievementsMessage="No achievements found."
    />
  );
}
