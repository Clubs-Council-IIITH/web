"use server";

import { getClient } from "gql/client";
import { EDIT_EVENT_REPORT } from "gql/mutations/events";

export async function editEventReportAction(details) {
  const response = { ok: false, data: null, error: null };

  try {
    const client = getClient();
    const result = await client.mutation(EDIT_EVENT_REPORT, { details });

    if (result.error) {
      response.error = {
        title: result.error.name,
        messages: result.error.graphQLErrors?.map((ge) => ge.message) || [
          result.error.message,
        ],
      };
    } else if (result.data) {
      response.ok = true;
      response.data = result.data.editEventReport;
    } else {
      response.error = {
        title: "Unexpected Error",
        messages: ["No data returned from GraphQL server."],
      };
    }
  } catch (error) {
    response.error = {
      title: "Request Error",
      messages: [error.message],
    };
  }

  return response;
}
