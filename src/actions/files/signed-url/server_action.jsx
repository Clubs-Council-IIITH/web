"use server";

import { getClient } from "gql/client";
import { GET_SIGNED_UPLOAD_URL } from "gql/queries/misc";

export async function getSignedUploadURL(details) {
  const response = { ok: false, error: null, data: null };

  try {
    const {
      data: { signedUploadURL },
    } = await getClient().query(GET_SIGNED_UPLOAD_URL, {
      details,
    });

    response.ok = true;
    response.data = signedUploadURL;
  } catch (e) {
    response.error = {
      title: e.name,
      messages: e?.graphQLErrors?.map((ge) => ge?.message),
      full: e,
    };
  }

  return response;
}
