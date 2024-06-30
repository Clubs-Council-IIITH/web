// handles approving a certificate
import { NextResponse } from "next/server";
import { getClient } from "gql/client";
import { APPROVE_CERTIFICATE } from "gql/mutations/members";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { certificateNumber } = await request.json();

  const { error } = await getClient().mutation(APPROVE_CERTIFICATE, {
    certificateNumber,
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
