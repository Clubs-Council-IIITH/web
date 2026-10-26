"use server";

import { getClient } from "gql/client";
import { APPROVE_ACHIEVEMENT } from "gql/mutations/achievements";

export async function approveAchievementAction(data) {
  const { achievementId } = data;
  const response = { ok: false, error: null };

  const { error } = await getClient().mutation(APPROVE_ACHIEVEMENT, {
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
