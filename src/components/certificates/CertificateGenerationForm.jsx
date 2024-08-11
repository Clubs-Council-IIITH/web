"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateCertificateHTML } from "utils/certificateTemplate";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { LoadingButton } from "@mui/lab";

import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useToast } from "components/Toast";
import { ISOtoHuman } from "utils/formatTime";
import Tag from "components/Tag";
import { stateLabel } from "utils/formatCertificates";

export default function CertificateGenerationForm({ userCertificates = [] }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { triggerToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(false);

  const isFormValid = reason.trim() !== "" && agreeToTerms;

  const handleCertificateRequest = async (event) => {
    event.preventDefault();
    if (!isFormValid) {
      return;
    }

    try {
      const payload = {
        certificateInput: {
          requestReason: reason,
        },
      };

      let res = await fetch("/actions/certificates/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error?.messages[0] || "Failed to request certificate"
        );
      }

      const data = await res.json();

      triggerToast({
        title: "Success!",
        messages: [
          "Certificate request submitted successfully. Please wait for approval.",
        ],
        severity: "success",
      });

      router.refresh();
    } catch (err) {
      triggerToast({
        title: "Error",
        messages: [err.message],
        severity: "error",
      });
    }
  };

  const handleDownload = async (certificateNumber) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/actions/certificates/fetch?certificateNumber=${certificateNumber}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch certificate data");
      }
      const certificate = await response.json();

      let certificateData;
      try {
        certificateData = JSON.parse(
          certificate.certificateData
            .replace(/'/g, '"')
            .replace(/None/g, "null")
        );
      } catch (error) {
        console.error("Error parsing certificate data:", error);
        throw new Error("Invalid certificate data");
      }

      const htmlContent = generateCertificateHTML(certificateData);

      // creating an offscreen div
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

      pdf.save(`certificate-${certificateNumber}.pdf`);

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
  };

  const hasPendingCertificates = (certs) => {
    return (
      certs &&
      certs.some(
        (cert) => cert.state !== "approved" && cert.state !== "rejected"
      )
    );
  };

  const handleRowClick = (cert) => {
    setSelectedCert(cert);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCert(null);
  };

  return (
    <>
      <Box mt={4}>
        {hasPendingCertificates(userCertificates) ? null : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(!showForm)}
            sx={{ mb: 2 }}
          >
            {showForm ? "Cancel Request" : "Request New Certificate"}
          </Button>
        )}

        {showForm && !hasPendingCertificates(userCertificates) && (
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleCertificateRequest}>
                <TextField
                  name="reason"
                  label="Reason for Certificate Generation"
                  multiline
                  rows={5}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  inputProps={{ maxLength: 2000 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      required
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                    />
                  }
                  label="I agree to the terms and conditions"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!isFormValid}
                  style={{
                    opacity: isFormValid ? 1 : 0.5,
                    cursor: isFormValid ? "pointer" : "not-allowed",
                  }}
                >
                  Submit Request
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Certificate Number</TableCell>
              <TableCell>Date Requested</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userCertificates
              .sort((a, b) =>
                b.certificateNumber
                  .toString()
                  .localeCompare(a.certificateNumber.toString())
              )
              .map((cert) => (
                <TableRow
                  key={cert.certificateNumber}
                  onClick={() => handleRowClick(cert)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <TableCell>{cert.certificateNumber}</TableCell>
                  <TableCell>{ISOtoHuman(cert.status.requestedAt)}</TableCell>
                  <TableCell>
                    <Tag
                      label={stateLabel(cert.state).name}
                      color={stateLabel(cert.state).color}
                    />
                  </TableCell>
                  <TableCell>
                    <LoadingButton
                      loading={loading}
                      variant="contained"
                      color="primary"
                      disabled={cert.state !== "approved"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(cert.certificateNumber);
                      }}
                    >
                      Download
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 2 }}>
          Certificate Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 2,
              alignItems: "baseline",
              mt: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Certificate Number:
            </Typography>
            <Typography variant="body1">
              {selectedCert?.certificateNumber}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              Request Date:
            </Typography>
            <Typography variant="body1">
              {selectedCert && ISOtoHuman(selectedCert.status.requestedAt)}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              Status:
            </Typography>
            <Typography variant="body1">
              {selectedCert && (
                <Tag
                  label={stateLabel(selectedCert.state).name}
                  color={stateLabel(selectedCert.state).color}
                />
              )}
            </Typography>

            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ alignSelf: "start" }}
            >
              Request Reason:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {selectedCert?.status?.requestReason || "No reason provided"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ borderTop: 1, borderColor: "divider", pt: 2, pb: 2 }}
        >
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
          {selectedCert && selectedCert.state === "approved" && (
            <LoadingButton
              loading={loading}
              onClick={() => handleDownload(selectedCert.certificateNumber)}
              color="primary"
              variant="contained"
            >
              Download
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
