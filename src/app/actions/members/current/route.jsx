import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { GET_MEMBERS } from "gql/queries/members";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { clubInput } = await request.json();

  const {
    error,
    data: { currentMembers },
  } = await getClient().query(GET_MEMBERS, { clubInput });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = [...currentMembers];
  }

  return NextResponse.json(response);
}
