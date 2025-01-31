"use server";

import { getClient } from "gql/client";
import { DOWNLOAD_MEMBERS_DATA } from "gql/queries/members";

export async function membersDataDownload(details) {
  const response = { ok: false, data: null, error: null };

  const { data, error } = await getClient().query(DOWNLOAD_MEMBERS_DATA, {
    details,
  });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = data;
  }
  return response;
}
