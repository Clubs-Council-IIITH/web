"use server";

import { getClient } from "gql/client";
import { EDIT_ACHIEVEMENT } from "gql/mutations/achievements";

export async function editAchievementAction(details, id) {
  const response = { ok: false, data: null, error: null };

  const { data, error } = await getClient().mutation(EDIT_ACHIEVEMENT, {
    details: { ...details, id },
  });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = data.editAchievement;
  }

  return response;
}
