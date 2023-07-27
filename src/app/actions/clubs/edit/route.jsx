import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { EDIT_CLUB } from "gql/mutations/clubs";
import { GET_CLUB, GET_ACTIVE_CLUBS, GET_ALL_CLUBS } from "gql/queries/clubs";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { clubInput, cid } = await request.json();

  try {
    await getClient().mutate({
      mutation: EDIT_CLUB,
      variables: { clubInput },
      refetchQueries: [
        { query: GET_ACTIVE_CLUBS },
        { query: GET_ALL_CLUBS },
        { query: GET_CLUB, variables: { clubInput: { cid } } },
      ],
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
