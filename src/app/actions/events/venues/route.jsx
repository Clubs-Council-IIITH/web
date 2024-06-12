import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { GET_AVAILABLE_LOCATIONS } from "gql/queries/events";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { startDate, endDate, eventid } = await request.json();

  const {
    data: { availableRooms },
    error,
  } = await getClient().query(GET_AVAILABLE_LOCATIONS, {
    startTime: startDate,
    endTime: endDate,
    eventid: eventid,
  });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = availableRooms;
  }

  return NextResponse.json(response);
}
