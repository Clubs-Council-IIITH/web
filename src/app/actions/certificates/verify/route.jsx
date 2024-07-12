// handling certificate verification
import { NextResponse } from "next/server";
import { getClient } from "gql/client";
import { VERIFY_CERTIFICATE } from "gql/queries/members";

export async function POST(request) {
  const response = { ok: false, data: null, error: null };
  const { certificateNumber, key } = await request.json();

  try {
    const { error, data } = await getClient().query(VERIFY_CERTIFICATE, {
      certificateNumber,
      key,
    });
    if (error) {
      response.error = {
        title: error.name,
        messages: error?.graphQLErrors?.map((ge) => ge?.message) || [
          "An unknown error occurred",
        ],
      };
    } else if (data && data.verifyCertificate) {
      response.ok = true;
      response.data = data.verifyCertificate;
    } else {
      throw new Error("No data returned from the server");
    }
  } catch (err) {
    console.error("Error verifying certificate:", err);
    response.error = {
      title: "Error",
      messages: [err.message || "An unexpected error occurred"],
    };
  }

  return NextResponse.json(response);
}
