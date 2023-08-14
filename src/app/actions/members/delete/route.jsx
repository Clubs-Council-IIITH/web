import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { DELETE_MEMBER } from "gql/mutations/members";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { memberInput } = await request.json();

  const { error } = await getClient().mutation(DELETE_MEMBER, { memberInput });
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
