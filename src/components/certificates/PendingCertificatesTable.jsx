"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useToast } from "components/Toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { generateCertificateHTML } from "utils/certificateTemplate";

export default function PendingCertificatesTable() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);
  const { triggerToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    fetchPendingCertificates();
  }, []);

  const fetchPendingCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/actions/certificates/pending");
      const data = await res.json();
      if (data.ok) {
        const certificatesWithUserInfo = await Promise.all(
          data.data.map(async (cert) => {
            const userRes = await fetch("/actions/users/get/full", {
              method: "POST",
              body: JSON.stringify({ uid: cert.userId }),
            });
            const userData = await userRes.json();
            if (userData.ok) {
              return {
                ...cert,
                userFullName: `${userData.data.firstName} ${userData.data.lastName}`,
                userEmail: userData.data.email,
                userRollno: userData.data.rollno,
                userBatch: userData.data.batch,
                userStream: userData.data.stream,
              };
            }
            return cert;
          })
        );
        setCertificates(certificatesWithUserInfo);
      } else {
        throw new Error(
          data.error?.messages?.[0] || "Failed to fetch pending certificates"
        );
      }
    } catch (err) {
      console.error("Error fetching pending certificates:", err);
      setError(
        "An error occurred while fetching pending certificates. Please try again later."
      );
      triggerToast({
        title: "Error",
        messages: [err.message],
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e, certificateNumber) => {
    e.stopPropagation();
    try {
      setProcessing(certificateNumber);
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
      setProcessing(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const handleAction = async (certificateNumber, action) => {
    setProcessing(certificateNumber);
    try {
      const res = await fetch(`/actions/certificates/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ certificateNumber }),
      });
      const data = await res.json();
      if (data.ok) {
        triggerToast({
          title: "Success",
          messages: [`Certificate ${action}d successfully`],
          severity: "success",
        });
        await fetchPendingCertificates(); // Refresh the list
      } else {
        throw new Error(
          data.error?.messages?.[0] || `Failed to ${action} certificate`
        );
      }
    } catch (err) {
      console.error(`Error ${action}ing certificate:`, err);
      triggerToast({
        title: "Error",
        messages: [err.message],
        severity: "error",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleRowClick = (cert) => {
    setSelectedCert(cert);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCert(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={3}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchPendingCertificates}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (certificates.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="h6">
          No pending certificate requests found.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="pending certificates table">
          <TableHead>
            <TableRow>
              <TableCell>Certificate Number</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certificates.map((cert) => (
              <TableRow
                key={cert._id}
                onClick={() => handleRowClick(cert)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <TableCell>{cert.certificateNumber}</TableCell>
                <TableCell>{cert.userFullName || "N/A"}</TableCell>
                <TableCell>{formatDate(cert.status.requestedAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(cert.certificateNumber, "approve");
                    }}
                    disabled={
                      processing === cert.certificateNumber ||
                      cert.state === "approved"
                    }
                    sx={{ mr: 1 }}
                  >
                    {processing === cert.certificateNumber ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(cert.certificateNumber, "reject");
                    }}
                    disabled={
                      processing === cert.certificateNumber ||
                      cert.state === "approved"
                    }
                  >
                    {processing === cert.certificateNumber ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Reject"
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => handleDownload(e, cert.certificateNumber)}
                    disabled={processing === cert.certificateNumber}
                  >
                    {processing === cert.certificateNumber ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Download"
                    )}
                  </Button>
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
          Certificate Request Details
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
              Student Name:
            </Typography>
            <Typography variant="body1">
              {selectedCert?.userFullName || "N/A"}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              Email:
            </Typography>
            <Typography variant="body1">
              {selectedCert?.userEmail || "N/A"}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              Roll Number:
            </Typography>
            <Typography variant="body1">
              {selectedCert?.userRollno || "N/A"}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              Batch:
            </Typography>
            <Typography variant="body1">
              {selectedCert?.userBatch?.toUpperCase()} ·{" "}
              {selectedCert?.userStream?.toUpperCase()}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              Request Date:
            </Typography>
            <Typography variant="body1">
              {selectedCert &&
                new Date(selectedCert.status.requestedAt).toLocaleDateString()}
            </Typography>

            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ alignSelf: "start" }}
            >
              Request Reason:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {selectedCert?.requestReason || "No reason provided"}
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
        </DialogActions>
      </Dialog>
    </>
  );
}
