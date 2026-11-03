"use server";

import { getClient } from "gql/client";
import { EDIT_ITEM_QTY, ADJUST_AVAILABLE_QTY } from "gql/mutations/inventory";

export async function editItemQtyAction(itemQtyInputs) {
  try {
    const { data, error } = await getClient().mutate(EDIT_ITEM_QTY, {
      itemQtyInputs,
    });

    if (error) {
      return {
        ok: false,
        error: {
          title: "Failed to update item quantity",
          messages: [error.message || "An unknown error occurred."],
        },
      };
    }

    return {
      ok: true,
      data: data?.editItemQty,
    };
  } catch (err) {
    return {
      ok: false,
      error: {
        title: "Failed to update item quantity",
        messages: [err.message || "An error occurred while updating quantity."],
      },
    };
  }
}

/**
 * Increment or decrement the available_qty of a single item.
 * @param {string} iid - Item ID
 * @param {number} delta - +1 or -1
 */
export async function adjustAvailableQtyAction(iid, delta) {
  try {
    const { data, error } = await getClient().mutate(ADJUST_AVAILABLE_QTY, {
      iid,
      delta,
    });

    if (error) {
      return {
        ok: false,
        error: {
          title: "Failed to adjust quantity",
          messages: [error.message || "An unknown error occurred."],
        },
      };
    }

    return {
      ok: true,
      data: data?.adjustAvailableQty,
    };
  } catch (err) {
    return {
      ok: false,
      error: {
        title: "Failed to adjust quantity",
        messages: [err.message || "An error occurred while adjusting quantity."],
      },
    };
  }
}
