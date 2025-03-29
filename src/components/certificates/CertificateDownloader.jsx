import html2pdf from 'html2pdf.js';
import { generateCertificateHTML } from "components/certificates/CertificateTemplate";

export default async function downloadCertificate(certificateData) {
  const htmlContent = await generateCertificateHTML(certificateData);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  document.body.style.backgroundColor = "#f8f6ec";
  document.body.appendChild(tempDiv);

  const options = {
    filename: `Certificate_${certificateData.certificateNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#f8f6ec' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', putOnlyUsedFonts: true },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().from(tempDiv).set(options).toPdf().get('pdf').then(function(pdf) {
      const totalPages = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;

      for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 5);
      }
  }).save();

  document.body.removeChild(tempDiv);
} 