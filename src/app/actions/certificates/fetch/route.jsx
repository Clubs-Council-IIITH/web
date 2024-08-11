import { NextResponse } from "next/server";
import { getClient } from "gql/client";
import { GET_CERTIFICATE_BY_NUMBER } from "gql/queries/members";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const certificateNumber = searchParams.get("certificateNumber");

  if (!certificateNumber) {
    return NextResponse.json(
      { error: "Certificate number is required" },
      { status: 400 }
    );
  }

  try {
    const { error, data } = await getClient().query(GET_CERTIFICATE_BY_NUMBER, {
      certificateNumber,
    });

    if (error) {
      return NextResponse.json(
        {
          error: error?.graphQLErrors?.map((ge) => ge?.message) || [
            "An unknown error occurred",
          ],
        },
        { status: 500 }
      );
    }

    if (!data || !data.getCertificateByNumber) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data.getCertificateByNumber);
  } catch (err) {
    console.error("Error fetching certificate:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
