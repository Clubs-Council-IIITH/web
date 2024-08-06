import { NextResponse } from "next/server";
import { getClient } from "gql/client";
import { GET_CERTIFICATE_BY_NUMBER } from "gql/queries/members";
import { generateCertificateHTML } from "utils/certificateTemplate";

function parsePythonLikeString(str) {
  // Replace Python's None with JavaScript's null
  str = str.replace(/None/g, "null");
  // Replace single quotes with double quotes
  str = str.replace(/'/g, '"');
  // Parse the resulting string as JSON
  return JSON.parse(str);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const certificateNumber = searchParams.get("certificateNumber");

  if (!certificateNumber) {
    return NextResponse.json(
      {
        ok: false,
        error: { title: "Error", messages: ["Certificate number is required"] },
      },
      { status: 400 }
    );
  }

  try {
    const { error, data } = await getClient().query(GET_CERTIFICATE_BY_NUMBER, {
      certificateNumber,
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

    if (!data || !data.getCertificateByNumber) {
      return NextResponse.json(
        {
          ok: false,
          error: { title: "Error", messages: ["Certificate not found"] },
        },
        { status: 404 }
      );
    }

    const certificate = data.getCertificateByNumber;

    let certificateData;
    try {
      certificateData = parsePythonLikeString(certificate.certificateData);
    } catch (error) {
      console.error("Error parsing certificate data:", error);
      return NextResponse.json(
        {
          ok: false,
          error: { title: "Error", messages: ["Invalid certificate data"] },
        },
        { status: 500 }
      );
    }

    const html = generateCertificateHTML(certificateData);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="certificate-${certificateNumber}.html"`,
      },
    });
  } catch (err) {
    console.error("Error generating certificate:", err);
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
