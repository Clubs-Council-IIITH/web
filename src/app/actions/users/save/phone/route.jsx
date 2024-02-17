import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { UPDATE_USERPHONE } from "gql/mutations/users";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { userDataInput } = await request.json();

  const { error } = await getClient().mutation(UPDATE_USERPHONE, {
    userDataInput,
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
