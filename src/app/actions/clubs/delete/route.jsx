import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { DELETE_CLUB } from "gql/mutations/clubs";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { cid } = await request.json();

  const { error } = await getClient().mutation(DELETE_CLUB, {
    clubInput: { cid },
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
