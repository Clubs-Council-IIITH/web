import { NextResponse } from "next/server";
import { getClient } from "gql/client";
import { GET_ALL_CERTIFICATES } from "gql/queries/members";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  try {
    const { error, data } = await getClient().query(GET_ALL_CERTIFICATES, {
      page,
      pageSize,
    });

    if (error) {
      return NextResponse.json({
        ok: false,
        error: {
          title: error.name,
          messages: error?.graphQLErrors?.map((ge) => ge?.message) || [
            "An unknown error occurred",
          ],
        },
      });
    }

    if (!data || !data.getAllCertificates) {
      return NextResponse.json(
        {
          ok: false,
          error: { title: "Error", messages: ["No certificate data found"] },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: data.getAllCertificates,
    });
  } catch (err) {
    console.error("Error fetching all certificates:", err);
    return NextResponse.json(
      {
        ok: false,
        error: {
          title: "Error",
          messages: [err.message || "An unexpected error occurred"],
        },
      },
      { status: 500 }
    );
  }
}
