// fetches certificates for the current user
import { NextResponse } from "next/server";
import { getClient } from "gql/client";
import { GET_USER_CERTIFICATES } from "gql/queries/members";

export async function GET() {
  const response = { ok: false, data: null, error: null };

  const {
    error,
    data: { getUserCertificates },
  } = await getClient().query(GET_USER_CERTIFICATES);
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
    response.data = [...getUserCertificates];
  }

  return NextResponse.json(response);
}
