"use server";

import { getClient } from "gql/client";
import { GET_ACTIVE_CLUB_IDS } from "gql/queries/clubs";

export async function getActiveClubIds() {
  const response = { ok: false, data: null, error: null };

  const {
    data: { activeClubs },
    error,
  } = await getClient().query(GET_ACTIVE_CLUB_IDS, {});
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = activeClubs;
  }

  return response;
}
