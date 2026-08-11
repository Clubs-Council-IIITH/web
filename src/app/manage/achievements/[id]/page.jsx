import { redirect } from "next/navigation";

import { Container } from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ACHIEVEMENT_BY_ID } from "gql/queries/achievements";

import ActionPalette from "components/ActionPalette";
import AchievementDetails from "components/achievements/AchievementDetails";
import {
  ApproveAchievement,
  DeleteAchievement,
  RejectAchievement,
} from "components/achievements/AchievementActions";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  try {
    const { data = {} } = await getClient().query(GET_ACHIEVEMENT_BY_ID, {
      achievementid: id,
    });
    return {
      title: data?.achievementById?.name ?? "Achievement",
    };
  } catch {
    return { title: "Achievement" };
  }
}

export default async function ManageAchievementPage(props) {
  const params = await props.params;
  const { id } = params;

  try {
    const { document, variables } = combineQuery("CombinedManageAchievementQuery")
      .add(GET_USER, { userInput: null })
      .add(GET_ACHIEVEMENT_BY_ID, { achievementid: id });

    const { data = {} } = await getClient().query(document, variables);
    const { userMeta, achievementById: achievement } = data;

    if (!achievement) redirect("/404");

    if (
      userMeta?.role === "club" &&
      !achievement?.clubids?.includes(userMeta?.uid)
    ) {
      redirect("/manage/achievements");
    }

    const sloActions = (userMeta?.role === "slo" || userMeta?.role==="cc") 
      ? [ApproveAchievement, RejectAchievement, DeleteAchievement]
      : [];

    return (
      <Container>
        <ActionPalette
          left={[]}
          right={sloActions}
        />
        <AchievementDetails achievement={achievement} />
      </Container>
    );
  } catch {
    redirect("/404");
  }
}
