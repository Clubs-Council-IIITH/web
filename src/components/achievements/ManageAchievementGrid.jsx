import { getClient } from "gql/client";
import { GET_ACHIEVEMENT_BY_CLUB } from "gql/queries/achievements";

import  ManageAchievementCards  from "./ManageAchievementCards";

export default async function ManageAchievementsGrid({
  achievements = null,
}) {

  return (
    <ManageAchievementCards
      achievements={achievements}
      loading={false}
      noAchievementsMessage="No achievements found."
    />
  );
}
