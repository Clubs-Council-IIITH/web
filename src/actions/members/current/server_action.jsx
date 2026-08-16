"use server";

import { getClient } from "gql/client";
import { GET_CURRENT_MEMBERS } from "gql/queries/members";

export async function currentMembersAction(clubInput) {
  const response = { ok: false, data: null, error: null };

  if (!clubInput?.cid) {
    response.error = {
      title: "Invalid Input",
      messages: ["Club ID is required"],
    };
    return response;
  }

  const { error, data } = await getClient().query(GET_CURRENT_MEMBERS, { clubInput });
 
  if (error || !data?.currentMembers) {
    response.error = {
      title: error?.name || "Error",
      messages: error?.graphQLErrors?.map((ge) => ge?.message) || ["Failed to fetch members"],
    };
  } else {
    response.ok = true;
    response.data = [...data.currentMembers];
  }

  return response;
}
