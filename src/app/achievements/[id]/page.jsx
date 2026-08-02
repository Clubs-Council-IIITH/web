import dayjs from "dayjs";

import { getAchievement } from "utils/fetchData";
import { shortDescription } from "app/layout";
import { getFile, PUBLIC_URL } from "utils/files";
import AchievementDetails from "components/achievements/AchievementDetails";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  const achievement = await getAchievement(id);
  const img = achievement.imageLinks?.length
  ? getFile(achievement.imageLinks[0], true)
  : `${PUBLIC_URL}/og-image.png`;

  const day = dayjs(achievement.dateperiod[0]). format("dddd")
    
  return {
    title: `${achievement.name} | Life @ IIITH`,
    description: achievement.content ? achievement.content : shortDescription,
    openGraph: {
      title: `${achievement.name} (Day: ${day}) | Life @ IIITH`,
      siteName: "Life @ IIITH",
      images: [
        {
          url: img,
          secure_url: img,
          width: 256,
          height: 256,
        },
      ],
    },
  };
}

export default async function Achievement(props) {
    const params = await props.params;
    const { id } = params;
    const achievement = await getAchievement(id);

    return <AchievementDetails achievement={achievement} />
}