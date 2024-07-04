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
} from "@mui/material";
import { useToast } from "components/Toast";

export default function PendingCertificatesTable() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(null);
  const { triggerToast } = useToast();

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

  const handleApprove = async (certificateNumber) => {
    setApproving(certificateNumber);
    try {
      const res = await fetch("/actions/certificates/approve", {
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
          messages: ["Certificate approved successfully"],
          severity: "success",
        });
        await fetchPendingCertificates(); // Refresh the list
      } else {
        throw new Error(
          data.error?.messages?.[0] || "Failed to approve certificate"
        );
      }
    } catch (err) {
      console.error("Error approving certificate:", err);
      triggerToast({
        title: "Error",
        messages: [err.message],
        severity: "error",
      });
    } finally {
      setApproving(null);
    }
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="pending certificates table">
        <TableHead>
          <TableRow>
            <TableCell>Certificate Number</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Request Date</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {certificates.map((cert) => (
            <TableRow key={cert._id}>
              <TableCell>{cert.certificateNumber}</TableCell>
              <TableCell>{cert.userId}</TableCell>
              <TableCell>{cert.status}</TableCell>
              <TableCell>
                {new Date(cert.requestedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApprove(cert.certificateNumber)}
                  disabled={approving === cert.certificateNumber}
                >
                  {approving === cert.certificateNumber ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Approve"
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
