"use server";

import { getClient } from "gql/client";
import { GET_ALL_CERTIFICATES } from "gql/queries/members";

export async function getAllCertificates(page = 1, pageSize = 10) {
  const response = { ok: false, data: null, error: null };

  try {
    const { error, data } = await getClient().query(GET_ALL_CERTIFICATES, {
      page,
      pageSize,
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

    if (!data || !data.getAllCertificates) {
      response.error = {
        title: "Error",
        messages: ["No certificate data found"],
      };

      return response;
    }

    response.ok = true;
    response.data = data.getAllCertificates;
  } catch (err) {
    console.error("Error fetching all certificates:", err);
    response.error = {
      title: "Error",
      messages: [err.message || "An unexpected error occurred"],
    };
  }

  return response;
}
