import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { PROGRESS_EVENT } from "gql/mutations/events";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { eventid, cc_progress_budget, cc_progress_room } =
    await request.json();

  const { error } = await getClient().mutation(PROGRESS_EVENT, {
    eventid,
    cc_progress_budget,
    cc_progress_room,
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