"use server";

import { getClient } from "gql/client";
import { GET_ACTIVE_CLUB_IDS } from "gql/queries/clubs";

export async function getActiveClubIds() {
  const response = { ok: false, data: null, error: null };

  const { data, error } = await getClient().query(GET_ACTIVE_CLUB_IDS, {});

  if (error || !data?.allClubs) {
    response.error = {
      title: error?.name || "Error",
      messages: error?.graphQLErrors?.map((ge) => ge?.message) || ["Failed to fetch clubs"],
    };
  } else {
    response.ok = true;
    response.data = data.allClubs;
  }

  return response;
}
