import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { EDIT_EVENT } from "gql/mutations/events";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { details, eventid } = await request.json();

  const {
    data: { editEvent },
    error,
  } = await getClient().mutation(EDIT_EVENT, {
    details: { ...details, eventid },
  });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = editEvent;
  }

  return NextResponse.json(response);
}
