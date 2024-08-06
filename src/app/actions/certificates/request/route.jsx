// handles requesting a new certificate
import { NextResponse } from "next/server";
import { getClient } from "gql/client";
import { REQUEST_CERTIFICATE } from "gql/mutations/members";

export async function POST(request) {
  const response = { ok: false, error: null };

  try {
    const body = await request.json();

    const { certificateInput } = body;

    if (!certificateInput) {
      throw new Error("Invalid input: certificateInput is required");
    }

    const client = getClient();

    const variables = { certificateInput };

    const { data, error } = await client.mutation(
      REQUEST_CERTIFICATE,
      variables
    );

    if (error) {
      response.error = {
        title: error.name,
        messages: error?.graphQLErrors?.map((ge) => ge?.message) || [
          error.message,
        ],
      };
    } else {
      response.ok = true;
      response.data = data.requestCertificate;
    }
  } catch (err) {
    response.error = {
      title: "Server Error",
      messages: [err.message || "An unexpected error occurred"],
    };
  }

  return NextResponse.json(response, {
    status: response.ok ? 200 : 500,
  });
}
