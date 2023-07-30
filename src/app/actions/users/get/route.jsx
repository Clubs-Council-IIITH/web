import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { uid } = await request.json();

  const { error, data: { userMeta, userProfile } = {} } =
    await getClient().query(GET_USER, { userInput: { uid } });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = { ...userMeta, ...userProfile };
  }

  return NextResponse.json(response);
}
