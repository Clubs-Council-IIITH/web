"use server";

import { getClient } from "gql/client";
import { GET_SIGNED_UPLOAD_URL } from "gql/queries/misc";

export async function uploadFiles() {
  const response = { ok: false, error: null, data: null };

  try {
    const {
      data: {
        signedUploadURL: { url },
      },
    } = await getClient().query(GET_SIGNED_UPLOAD_URL);

    response.ok = true;
    response.data = { url };
  } catch (e) {
    response.error = {
      title: e.name,
      messages: e?.graphQLErrors?.map((ge) => ge?.message),
      full: e,
    };
  }

  return response;
}
