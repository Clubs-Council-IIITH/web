import { Box } from "@mui/material"

import { getClient } from "gql/client";
import { GET_ALL_ACHIEVEMENTS } from "gql/queries/achievements";

import AchievementCards from "components/achievements/AchievementCards";
import AchievementsFilter from "components/achievements/AchievementsFilter";

export const metadata = {
  title: "Achievements | Life @ IIIT-H",
};

async function query(querystring) {
  "use server"

  const { data = {}, error } = await getClient().query(GET_ALL_ACHIEVEMENTS, {
    cid: querystring["targetClub"],
    name: querystring["targetName"],
    limit: querystring["limit"],
  });

  console.log("DATA:", data);
  if (error) {
    console.error(error);
    return [];
  }

  return data?.allAchievements || [];
}

export default async function Achievements(props) {
  const searchParams = await props.searchParams;
  const targetName = searchParams?.name;
  const targetClub = searchParams?.club;

  const achievements = await query(searchParams);

  const filtered_achievements = achievements.filter((achievement) => {
    const achievementsClub = !targetClub || achievement.clubids.includes(targetClub);

    const achievementsName = !targetName || achievement.name.toLowerCase().includes(targetName.toLowerCase());

    return achievementsClub && achievementsName;
  })

  console.log("ACHIEVEMENTS:", achievements);
  return (
    <Box>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <AchievementsFilter name={targetName} club={targetClub} />
      </Box>
      <Box
        sx={{
          my: 1,
        }}
      />
      <AchievementCards 
        achievements={filtered_achievements}
        loading={false}
        noAchievementsMessage="No achievements found."
       />
    </Box>
  );
}