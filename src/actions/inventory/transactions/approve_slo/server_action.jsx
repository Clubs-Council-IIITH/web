"use server";

import { getClient } from "gql/client";
import { APPROVE_SLO_TRANSACTION } from "gql/mutations/inventory";

export async function approveSLOTransactionAction(tid, sloComment = null) {
  const response = { ok: false, data: null, error: null };

  try {
    const client = getClient();
    const result = await client.mutation(APPROVE_SLO_TRANSACTION, {
      tid,
      sloComment,
    });

    if (result.error) {
      response.error = {
        title: result.error.name,
        messages: result.error.graphQLErrors?.map((ge) => ge.message) || [
          result.error.message,
        ],
      };
    } else if (result.data) {
      response.ok = true;
      response.data = result.data.approveSLOTransaction;
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
