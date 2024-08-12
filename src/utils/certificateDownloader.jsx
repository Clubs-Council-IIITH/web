import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { generateCertificateHTML } from "./certificateTemplate";

import { fetchCertificate } from "app/actions/certificates/fetch/server_action";

export async function downloadCertificate(
  certificateNumber,
  triggerToast,
  setLoading
) {
  try {
    setLoading(true);

    const response = await fetchCertificate(certificateNumber);

    if (!response.ok) {
      const errorData = response.error || {};
      throw new Error(errorData.error || "Failed to fetch certificate data");
    }

    const certificate = response.data;

    let certificateData;
    try {
      certificateData = JSON.parse(
        certificate.certificateData.replace(/'/g, '"').replace(/None/g, "null")
      );
    } catch (error) {
      console.error("Error parsing certificate data:", error);
      throw new Error("Invalid certificate data");
    }

    const htmlContent = generateCertificateHTML(certificateData);

    // Create an off-screen div
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "-9999px";
    tempDiv.style.width = "1123px"; // A4 width in pixels at 300 DPI
    tempDiv.style.height = "794px"; // A4 height in pixels at 300 DPI
    document.body.appendChild(tempDiv);

    // Wait for fonts and images to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff", // Ensure white background
    });

    document.body.removeChild(tempDiv);

    // new jsPDF instance
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);

    pdf.save(`Certificate-${certificateNumber}.pdf`);

    triggerToast({
      title: "Success",
      messages: ["Certificate downloaded successfully"],
      severity: "success",
    });
  } catch (error) {
    console.error("Error downloading certificate:", error);
    triggerToast({
      title: "Error",
      messages: [error.message || "Failed to download certificate"],
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
}
