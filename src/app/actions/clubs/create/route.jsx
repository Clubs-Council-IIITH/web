import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { CREATE_CLUB } from "gql/mutations/clubs";
import { GET_ACTIVE_CLUBS, GET_ALL_CLUBS } from "gql/queries/clubs";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { clubInput } = await request.json();

  try {
    await getClient().mutate({
      mutation: CREATE_CLUB,
      variables: { clubInput },
      refetchQueries: [{ query: GET_ACTIVE_CLUBS }, { query: GET_ALL_CLUBS }],
      awaitRefetchQueries: true,
    });
    response.ok = true;
  } catch (e) {
    response.error = {
      title: e.name,
      messages: e?.graphQLErrors?.map((ge) => ge?.message),
    };
  }

  return NextResponse.json(response);
}
