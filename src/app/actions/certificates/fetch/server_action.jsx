"use server";

import { getClient } from "gql/client";
import { GET_CERTIFICATE_BY_NUMBER } from "gql/queries/members";

export async function fetchCertificate(certificateNumber) {
  let response = { ok: false, data: null, error: null };

  if (!certificateNumber) {
    response.error = {
      title: "Error",
      messages: ["Certificate number is required"],
    };

    return response;
  }

  try {
    const { error, data } = await getClient().query(GET_CERTIFICATE_BY_NUMBER, {
      certificateNumber,
    });

    if (error) {
      response.error = {
        title: error.name,
        messages: error?.graphQLErrors?.map((ge) => ge?.message) || [
          "An unknown error occurred",
        ],
      };

      return response;
    }

    if (!data || !data.getCertificateByNumber) {
      response.error = {
        title: "Error",
        messages: ["Certificate not found"],
      };

      return response;
    }

    response.ok = true;
    response.data = data.getCertificateByNumber;
  } catch (err) {
    console.error("Error fetching certificate:", err);
    response.error = {
      title: "Error",
      messages: [err.message || "An unexpected error occurred"],
    };
  }

  return response;
}
