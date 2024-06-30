// handling certificate verification
import { NextResponse } from "next/server";
import { getClient } from "gql/client";
import { VERIFY_CERTIFICATE } from "gql/queries/members";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { certificateNumber, key } = await request.json();

  const {
    error,
    data: { verifyCertificate },
  } = await getClient().query(VERIFY_CERTIFICATE, { certificateNumber, key });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = verifyCertificate;
  }

  return NextResponse.json(response);
}
