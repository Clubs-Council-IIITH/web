"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

import { ISOtoHuman } from "utils/formatTime";

export default function VerifyCertificatePage() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCertificate(null);

    try {
      const response = await fetch("/actions/certificates/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ certificateNumber, key }),
      });

      const result = await response.json();

      if (result.ok && result.data) {
        setCertificate(result.data);
      } else {
        setError(result.error?.messages?.[0] || "Failed to verify certificate");
      }
    } catch (err) {
      // console.error("Error verifying certificate:", err);
      setError("An error occurred while verifying the certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Verify Certificate
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Certificate Number"
              variant="outlined"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Verification Key"
              variant="outlined"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Verify Certificate"}
            </Button>
          </form>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {certificate && (
          <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Certificate Details
            </Typography>
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
                {certificate.certificateNumber}
              </Typography>

              <Typography variant="subtitle2" fontWeight="bold">
                User ID:
              </Typography>
              <Typography variant="body1">{certificate.userId}</Typography>

              <Typography variant="subtitle2" fontWeight="bold">
                Status:
              </Typography>
              <Typography variant="body1">{certificate.state}</Typography>

              <Typography variant="subtitle2" fontWeight="bold">
                Request Date:
              </Typography>
              <Typography variant="body1">
                {ISOtoHuman(certificate.status.requestedAt)}
              </Typography>

              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ alignSelf: "start" }}
              >
                Request Reason:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {certificate.requestReason || "No reason provided"}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
