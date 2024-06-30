import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { CREATE_HOLIDAY } from "gql/mutations/holidays";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { details } = await request.json();

  const {
    data: { createHoliday },
    error,
  } = await getClient().mutation(CREATE_HOLIDAY, { details });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = createHoliday;
  }

  return NextResponse.json(response);
}
