"use server";

import { getClient } from "gql/client";
import { DELETE_ACHIEVEMENT } from "gql/mutations/achievements";

export async function deleteAchievementAction(data) {
  const { achievementId } = data;
  const response = { ok: false, error: null };

  const { error } = await getClient().mutation(DELETE_ACHIEVEMENT, {
    achievementId,
  });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
  }

  return response;
}