import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ACHIEVEMENT_BY_ID } from "gql/queries/achievements";

import AchievementForm from "components/achievements/achievements_form";

export const metadata = {
  title: "Edit Achievement",
};

function transformAchievement(achievement) {
  return {
    ...achievement,
    // parse datetime strings to date objects
    dateperiod: [
      new Date(achievement?.dateperiod[0]),
      new Date(achievement?.dateperiod[1])
    ],
  }
}

export default async function EditAchievement(props) {
  const params = await props.params;
  const { id } = params;

  try {
    const { document, variables } = combineQuery("CombinedEditAchievementQuery")
      .add(GET_USER, { userInput: null })
      .add(GET_ACHIEVEMENT_BY_ID, { achievementid: id });

      const { data = {} } = await getClient().query(document, variables);

      const { userMeta, userProfile, achievement } = data;
      const user = { ...userMeta, ...userProfile };

    return (
      user?.role === "club" && !achievement.clubids.includes(user?.uid),
      (
        <Container>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              mb: 3,
            }}
          >
            Edit Achievement Details
          </Typography>
          <AchievementForm
            id={id}
            defaultValues={transformAchievement(achievement)}
            action="edit"
          />
        </Container>
      )
    );
  } catch (error) {
    redirect("/404");
  }
}