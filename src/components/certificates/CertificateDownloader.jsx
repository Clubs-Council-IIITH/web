import html2pdf from 'html2pdf.js';
import { generateCertificateHTML } from "components/certificates/CertificateTemplate";

export default async function DownloadCertificate(certificateData) {
  const htmlContent = await generateCertificateHTML(certificateData);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.backgroundColor = "#f8f6ec";
  document.body.appendChild(tempDiv);

  const options = {
    filename: `Certificate_${certificateData.certificateNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#f8f6ec' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
  };

  html2pdf().from(tempDiv).set(options).save();

  document.body.removeChild(tempDiv);
}