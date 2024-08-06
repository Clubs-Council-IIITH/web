// handles rejecting the certificate
import { NextResponse } from "next/server";
import { getClient } from "gql/client";
import { REJECT_CERTIFICATE } from "gql/mutations/members";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { certificateNumber } = await request.json();

  const { data, error } = await getClient().mutation(REJECT_CERTIFICATE, {
    certificateNumber,
  });

  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = data.rejectCertificate;
  }

  return NextResponse.json(response);
}
