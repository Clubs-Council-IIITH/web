"use server";

import { getClient } from "gql/client";
import { GET_PENDING_CERTIFICATES } from "gql/queries/members";

export async function getPendingCertificates() {
  const response = { ok: false, data: null, error: null };

  const {
    error,
    data: { getPendingCertificates },
  } = await getClient().query(GET_PENDING_CERTIFICATES);
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = [...getPendingCertificates];
  }

  return response;
}
