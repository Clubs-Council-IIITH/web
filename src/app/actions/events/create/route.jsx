import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { CREATE_EVENT } from "gql/mutations/events";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { details } = await request.json();
  const {
    data: { createEvent },
    error,
  } = await getClient().mutation(CREATE_EVENT, { details });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = createEvent;
  }

  return NextResponse.json(response);
}
