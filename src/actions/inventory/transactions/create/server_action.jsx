"use server";

import { getClient } from "gql/client";
import { CREATE_TRANSACTION } from "gql/mutations/inventory";

export async function createTransactionAction(details) {
  const response = { ok: false, data: null, error: null };

  try {
    const client = getClient();
    const result = await client.mutation(CREATE_TRANSACTION, { details });

    if (result.error) {
      response.error = {
        title: result.error.name,
        messages: result.error.graphQLErrors?.map((ge) => ge.message) || [
          result.error.message,
        ],
      };
    } else if (result.data) {
      response.ok = true;
      response.data = result.data.createTransaction;
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
