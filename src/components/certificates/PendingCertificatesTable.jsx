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
        setCertificates(data.data || []);
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
              <TableCell>User ID</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>State</TableCell>
              <TableCell>CC Approved</TableCell>
              <TableCell>SLO Approved</TableCell>
              <TableCell>Actions</TableCell>
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
                <TableCell>{cert.userId}</TableCell>
                <TableCell>{formatDate(cert.status.requestedAt)}</TableCell>
                <TableCell>{cert.state}</TableCell>
                <TableCell>{formatDate(cert.status.ccApprovedAt)}</TableCell>
                <TableCell>{formatDate(cert.status.sloApprovedAt)}</TableCell>
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
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Certificate Number:
            </Typography>
            <Typography variant="body1">
              {selectedCert?.certificateNumber}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              User ID:
            </Typography>
            <Typography variant="body1">{selectedCert?.userId}</Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              Request Date:
            </Typography>
            <Typography variant="body1">
              {selectedCert &&
                new Date(selectedCert.status.requestedAt).toLocaleDateString()}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              State:
            </Typography>
            <Typography variant="body1">{selectedCert?.state}</Typography>

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
