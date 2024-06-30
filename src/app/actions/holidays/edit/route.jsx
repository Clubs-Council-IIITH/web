import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { EDIT_HOLIDAY } from "gql/mutations/holidays";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { details, holidayId } = await request.json();

  const {
    data: { editHoliday } = {},
    error,
  } = await getClient().mutation(EDIT_HOLIDAY, {
    details,
    holidayId,
  });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = editHoliday;
  }

  return NextResponse.json(response);
}
