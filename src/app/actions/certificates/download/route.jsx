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
  console.log("1. Download route started");
  const { searchParams } = new URL(request.url);
  const certificateNumber = searchParams.get("certificateNumber");
  console.log("2. Certificate number:", certificateNumber);

  if (!certificateNumber) {
    console.log("3. Certificate number is missing");
    return NextResponse.json(
      {
        ok: false,
        error: { title: "Error", messages: ["Certificate number is required"] },
      },
      { status: 400 }
    );
  }

  try {
    console.log("4. Fetching certificate data from GraphQL");
    const { error, data } = await getClient().query(GET_CERTIFICATE_BY_NUMBER, {
      certificateNumber,
    });

    console.log("5. GraphQL response received");

    if (error) {
      console.log("6. GraphQL errors:", error);
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
      console.log("7. Certificate data missing in response");
      return NextResponse.json(
        {
          ok: false,
          error: { title: "Error", messages: ["Certificate not found"] },
        },
        { status: 404 }
      );
    }

    const certificate = data.getCertificateByNumber;
    console.log("8. Certificate:", JSON.stringify(certificate, null, 2));

    console.log(
      "9. Certificate data type:",
      typeof certificate.certificateData
    );
    console.log("10. Certificate data:", certificate.certificateData);

    let certificateData;
    try {
      console.log("11. Parsing certificate data");
      certificateData = parsePythonLikeString(certificate.certificateData);
      console.log(
        "12. Parsed certificate data:",
        JSON.stringify(certificateData, null, 2)
      );
    } catch (error) {
      console.error("13. Error parsing certificate data:", error);
      return NextResponse.json(
        {
          ok: false,
          error: { title: "Error", messages: ["Invalid certificate data"] },
        },
        { status: 500 }
      );
    }

    console.log("14. Generating HTML");
    const html = generateCertificateHTML(certificateData);
    console.log("15. HTML generated");

    console.log("16. Sending response");
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="certificate-${certificateNumber}.html"`,
      },
    });
  } catch (err) {
    console.error("17. Error generating certificate:", err);
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
