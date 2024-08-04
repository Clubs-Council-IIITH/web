export function generateCertificateHTML(certificateData) {
  console.log("1. generateCertificateHTML started");
  console.log("2. Certificate data:", JSON.stringify(certificateData, null, 2));

  if (!certificateData || typeof certificateData !== "object") {
    console.error("3. Invalid certificate data:", certificateData);
    throw new Error("Invalid certificate data");
  }

  const user_id = certificateData.user_id || "Unknown User";
  console.log("4. User ID:", user_id);

  const memberships = Array.isArray(certificateData.memberships)
    ? certificateData.memberships
    : [];
  console.log("5. Memberships:", JSON.stringify(memberships, null, 2));

  const membershipList = memberships
    .map((membership, index) => {
      console.log(
        `6. Processing membership ${index}:`,
        JSON.stringify(membership, null, 2)
      );

      const name = membership.name || "Unknown Position";
      const cid = (membership.cid || "Unknown Club").toUpperCase();
      const startYear = membership.startYear || "Unknown";
      const endYear = membership.endYear || "Present";

      return `
        <li>
          ${name} at ${cid}
          (${startYear} - ${endYear})
        </li>
      `;
    })
    .join("");

  console.log("7. Generating HTML");
  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Participation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px;
          }
          h1 {
            color: #1a237e;
          }
          .certificate {
            border: 10px solid #1a237e;
            padding: 25px;
            margin-top: 20px;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>Certificate of Participation</h1>
          <p>This is to certify that</p>
          <h2>${user_id}</h2>
          <p>has actively participated in the following roles:</p>
          <ul>
            ${membershipList || "<li>No memberships found</li>"}
          </ul>
          <p>We appreciate their dedication and contributions.</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;
  console.log("8. HTML generated");

  return html;
}
