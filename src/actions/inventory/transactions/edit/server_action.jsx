"use server";

import { getClient } from "gql/client";
import { EDIT_TRANSACTION } from "gql/mutations/inventory";

export async function editTransactionAction(details) {
  const response = { ok: false, data: null, error: null };

  try {
    const result = await getClient().mutation(EDIT_TRANSACTION, { details });

    if (result.error) {
      response.error = {
        title: result.error.name,
        messages: result.error.graphQLErrors?.map((error) => error.message) || [
          result.error.message,
        ],
      };
    } else if (result.data?.editTransaction) {
      response.ok = true;
      response.data = result.data.editTransaction;
    } else {
      response.error = {
        title: "Unexpected Error",
        messages: ["No transaction was returned from the GraphQL server."],
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
