"use server";

import { getClient } from "gql/client";
import { CREATE_INVENTORY_ITEM } from "gql/mutations/inventory";

export async function createInventoryItemAction(details) {
  const response = { ok: false, data: null, error: null };

  try {
    const result = await getClient().mutation(CREATE_INVENTORY_ITEM, { details });

    if (result.error) {
      response.error = {
        title: result.error.name,
        messages: result.error.graphQLErrors?.map((error) => error.message) || [
          result.error.message,
        ],
      };
    } else if (result.data?.addItem) {
      response.ok = true;
      response.data = result.data.addItem;
    } else {
      response.error = {
        title: "Unexpected Error",
        messages: ["No item was returned from the GraphQL server."],
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
