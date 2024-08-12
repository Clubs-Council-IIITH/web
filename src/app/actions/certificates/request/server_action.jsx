"use server";

import { getClient } from "gql/client";
import { REQUEST_CERTIFICATE } from "gql/mutations/members";

export async function requestCertificate(requestReason) {
  try {
    const client = getClient();

    const variables = {
      certificateInput: {
        requestReason,
      },
    };

    const { data, error } = await client.mutation(
      REQUEST_CERTIFICATE,
      variables
    );

    if (error) {
      return { ok: false, error };
    } else {
      return { ok: true, data: data.requestCertificate };
    }
  } catch (err) {
    return { ok: false, error: err };
  }
}
