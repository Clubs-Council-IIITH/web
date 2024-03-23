import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { PROGRESS_EVENT } from "gql/mutations/events";

export async function POST(request) {
  const response = { ok: false, error: null };
  const {
    eventid,
    cc_progress_budget = false,
    cc_progress_room = false,
    cc_approver = null,
  } = await request.json();

  const { error } = await getClient().mutation(PROGRESS_EVENT, {
    eventid,
    ccProgressBudget: cc_progress_budget,
    ccProgressRoom: cc_progress_room,
    ccApprover: cc_approver,
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
