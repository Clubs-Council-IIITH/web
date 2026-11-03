"use server";

import { getClient } from "gql/client";
import { EDIT_INVENTORY_ITEM } from "gql/mutations/inventory";

export async function editInventoryItemAction(details) {
  const response = { ok: false, data: null, error: null };

  try {
    const result = await getClient().mutation(EDIT_INVENTORY_ITEM, { details });

    if (result.error) {
      response.error = {
        title: result.error.name,
        messages: result.error.graphQLErrors?.map((error) => error.message) || [
          result.error.message,
        ],
      };
    } else if (result.data?.editItem) {
      response.ok = true;
      response.data = result.data.editItem;
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
