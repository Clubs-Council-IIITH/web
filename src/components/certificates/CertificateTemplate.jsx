import QRCode from "qrcode";
const IIITLogo = "/assets/iiit-logo-white.png";

export async function generateCertificateHTML(certificateData) {
  const data = JSON.parse(certificateData.certificateData);
  const memberships = data.memberships;
  const qrLink = `https://clubs.iiit.ac.in/certificates/verify?certificateId=${certificateData.certificateNumber}&validationKey=${certificateData?.key}`;
  const qrCodeURL = await QRCode.toDataURL(qrLink);

  let rowsPerTable = 6;

  const membershipChunks = [];
  let i = 0;
  while(i < memberships.length){
    membershipChunks.push(memberships.slice(i, i + rowsPerTable));
    i += rowsPerTable
    rowsPerTable = 14;
  }

  const membershipTables = membershipChunks.map((chunk, index) => {
    const rows = chunk.map(member => `
      <tr>
        <td>${member.clubName}</td>
        <td>${member.name}</td>
        <td>${member.startYear} - ${member.endYear || "Present"}</td>
      </tr>
    `).join('');

    return `
      <table class="activities-table">
        <thead>
          <tr>
            <th>CLUB NAME</th>
            <th>POSITION</th>
            <th>YEAR</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Commendation Certificate</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: Arial, sans-serif;
                color: black;
                background-color: #f8f6ec;
                margin: 0;
            }

            .certificate {
                background-color: #f8f6ec;
                position: relative;
                display: flex;
                margin: auto;
                padding: 0;
            }

            .sidebar {
              width: 22%;
              background-color: #051b63;
              padding-left: 10px;
              padding-right: 10px;
              display: flex;
              flex-direction: column;
              align-items: center; 
            }

            .glass{
              background-color: #000000;
              opacity: 0.8;
            }

            .logo {
              width: 80%;
              padding-top: 40px;
              margin-bottom: 0px;
            }

            .address {
              color: white;
              font-family: 'Times New Roman', Times, serif;
              font-size: 12px;
              font-weight: 600;
              text-align: center;
              margin-top: auto;
              padding-bottom: 60px;
              max-width: 180px;
            }

            .sidebar .address {
              width: 100%;
              max-width: 180px;
            }
            
            .content {
                flex: 1;
                padding: 40px 60px;
                position: relative;
            }

            .cert-header, .cert-body {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }

            .certificate-header {
                font-family: 'Times New Roman', Times, serif;
                text-align: left;
                letter-spacing: 1px;
            }

            .certificate-title {
                font-size: 40px;
                font-weight: 600;
                margin-bottom: 20px;
                line-height: 1.2;
            }

            .certificate-number {
                margin-top: 30px;
                margin-right: 20px;
                text-align: right;
                flex-direction: column;
            }

            .certificate-date {
                margin-top: 10px;
            }

            .signatures {
                margin-top: 70px;
                display: flex;
                gap: 50px;
                width: auto;
                text-align: center;
            }

            .signature-line {
                width: 200px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .signature-line .line {
                border-top: 1px solid #333;
                margin-bottom: 5px;
                width: 100%;
            }

            .signature-line .title {
                font-size: 14px;
                color: #333;
                font-weight: bold;
                margin-top: 5px;
            }

            .recipient-details {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .recipient-name {
                font-size: 36px;
                font-weight: bold;
                margin: 20px 0 10px 0;
                border-bottom: 1px solid #E87722;
                padding-bottom: 15px;
                width: 100%;
            }

            .recipient-roll {
                font-size: 20px;
                color: #666;
                margin-bottom: 20px;
            }

            .certificate-text {
                font-size: 18px;
                line-height: 1.6;
                color: #666;
            }

            .activities-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                background-color: #ece7cc;
                margin: 10px 0;
                border-radius: 10px;
                overflow: hidden;
                page-break-inside: avoid; /* Prevent table splitting */
            }

            .activities-table th,
            .activities-table td {
                color: black;
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }

            .activities-table th {
                background-color: #ece7cc;
                font-weight: bold;
                text-align: left;
            }

            .activities-table td {
                color: #333;
            }

            .activities-table th:nth-child(1) {
                width: 40%;
            }

            .activities-table th:nth-child(2) {
                width: 40%;
            }

            .activities-table th:nth-child(3) {
                width: 20%;
            }

            .verification-section {
                margin-top: 22px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 30px;
            }

            .validation-key {
                text-align: right;
                color: #666;
            }

            .qr {
                margin-top: 20px;
                display: flex;
                align-items: center;
            }

            .qr-code {
                width: 120px;
                height: 120px;
            }

            .verification-text {
                margin-left: 20px;
                font-size: 16px;
                color: #666;
                line-height: 1.6;
            }
            .certificate,
            .certificate-text,
            .recipient-details,
            .activities-table,
            .verification-section {
                page-break-inside: avoid;
            }

        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="sidebar glass">
                <img src="${IIITLogo}" alt="IIIT Hyderabad Logo" class="logo">
                <div class="address">Professor CR Rao Rd, Gachibowli, Hyderabad, Telangana-500032</div>
            </div>
            <div class="content">
                <div class="cert-header">
                    <div class="certificate-header">
                        <div class="certificate-title">COMMENDATION<br />LETTER</div>
                    </div>
                    <div class="certificate-number">
                        Certificate Number:<br>
                        <b>${certificateData.certificateNumber}</b><br>
                        <div class="certificate-date">Date:<br> <b>${new Date().toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}</b></div>
                    </div>
                </div>

                <div class="cert-body">
                    <div>
                        <div>THIS IS TO CERTIFY THAT</div>
                        <div class="recipient-details">
                            <div class="recipient-name">${certificateData.userFullName}</div>
                        </div>
                    </div>
                </div>
                <div class="recipient-roll">Roll Number: <b>${certificateData.userRollno}</b></div>

                <div class="certificate-text">
                    In recognition of outstanding contributions to various clubs & activities as detailed below:
                </div>

                ${membershipTables} <!-- Render multiple tables here -->

                <div class="signatures">
                    <div class="signature-line">
                        <div class="line"></div>
                        <div class="title">Chair, Student Life Committee</div>
                    </div>
                    <div class="signature-line">
                        <div class="line"></div>
                        <div class="title">Chair, Student Affairs Committee</div>
                    </div>
                </div>
                <div class="verification-section">
                    <div class="qr">
                        <img src="${qrCodeURL}" alt="QR Code" class="qr-code">
                        <div class="verification-text">
                            <a href="${qrLink}">https://clubs.iiit.ac.in/certificates/verify</a><br />
                            Scan this QR code or visit the link above and enter<br>
                            the certificate number and key to validate<br>
                            the certificate.
                        </div>
                    </div>
                    <div class="validation-key">
                        Validation Key<br>
                        ${certificateData.key}<br>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}