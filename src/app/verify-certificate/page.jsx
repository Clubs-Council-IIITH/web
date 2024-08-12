"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";

import { getFullUser } from "app/actions/users/get/full/server_action";
import { verifyCertificate } from "app/actions/certificates/verify/server_action";
import { useToast } from "components/Toast";
import { ISOtoHuman } from "utils/formatTime";

export default function VerifyCertificatePage() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [user, setUser] = useState(null);
  const { triggerToast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setCertificate(null);

    try {
      const result = await verifyCertificate(certificateNumber, key);

      if (result.ok && result.data) {
        setCertificate(result.data);

        const res = await getFullUser(result.data.userId);

        if (!res.ok) {
          triggerToast({
            title: "Unable to fetch user data",
            messages: res.error.messages,
            severity: "error",
          });
        } else {
          console.log(res.data);
          setUser(res.data);
        }
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
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? <CircularProgress size={24} /> : "Verify Certificate"}
          </Button>
        </Paper>

        {error ? (
          <Typography
            variant="body1"
            color="error"
            sx={{ mt: 2, textTransform: "capitalize" }}
          >
            <center>{error}</center>
          </Typography>
        ) : null}

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
                mt: 3,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                Certificate Number:
              </Typography>
              <Typography variant="body1">
                {certificate.certificateNumber}
              </Typography>

              <Typography variant="subtitle2" fontWeight="bold">
                Name:
              </Typography>
              <Typography variant="body1">
                {user?.firstName} {user?.lastName}
              </Typography>

              <Typography variant="subtitle2" fontWeight="bold">
                Email:
              </Typography>
              <Typography variant="body1">{user?.email}</Typography>

              <Typography variant="subtitle2" fontWeight="bold">
                Roll Number:
              </Typography>
              <Typography variant="body1">{user?.rollno}</Typography>

              <Typography variant="subtitle2" fontWeight="bold">
                Batch:
              </Typography>
              <Typography variant="body1">
                {user?.batch.toUpperCase()} · {user?.stream.toUpperCase()}
              </Typography>

              <Typography variant="subtitle2" fontWeight="bold">
                Issued Date:
              </Typography>
              <Typography variant="body1">
                {ISOtoHuman(certificate.status.requestedAt)}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
