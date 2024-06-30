import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { DELETE_HOLIDAY } from "gql/mutations/holidays";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { holidayId } = await request.json();

  const { error } = await getClient().mutation(DELETE_HOLIDAY, {
    holidayId,
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
