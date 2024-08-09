import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { UPDATE_BILLS_STATUS } from "gql/mutations/events";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { details } = await request.json();

  const { data: { updateBillsStatus } = {}, error } =
    await getClient().mutation(UPDATE_BILLS_STATUS, {
      details,
    });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = updateBillsStatus;
  }

  return NextResponse.json(response);
}
