import { notFound, redirect } from "next/navigation";

import { getClient } from "gql/client";
import { GET_ACHIEVEMENT_ID_FROM_CODE } from "gql/queries/achievements";

export default async function AchievementByCode(props) {
  const params = await props.params;
  const { code } = params;

  const { data = {}, error } = await getClient().query(GET_ACHIEVEMENT_ID_FROM_CODE, {
    code,
  });

  console.log("CODE:", code);
console.log("DATA:", data);
console.log("ERROR:", error);

  if (error || !data?.achievementid) notFound();

  redirect(`/manage/achievements/${data.achievementid}`);
}
