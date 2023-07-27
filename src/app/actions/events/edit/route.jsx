import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { EDIT_EVENT } from "gql/mutations/events";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { details, eventid } = await request.json();

  const { error } = await getClient().mutation(EDIT_EVENT, {
    details: { ...details, eventid },
  });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
  }

  return NextResponse.json(response);
}
