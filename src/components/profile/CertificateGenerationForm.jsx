"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import { useToast } from "components/Toast";

export default function CertificateGenerationForm() {
  const [reason, setReason] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const { triggerToast } = useToast();

  const isFormValid = reason.trim() !== "" && agreeToTerms;

  useEffect(() => {
    fetchUserCertificates();
  }, []);

  const fetchUserCertificates = async () => {
    try {
      const res = await fetch("/actions/certificates/user");
      const data = await res.json();
      if (data.ok) {
        setCertificates(data.data);
      } else {
        throw new Error(
          data.error.messages[0] || "Failed to fetch certificates"
        );
      }
    } catch (err) {
      triggerToast({
        title: "Error",
        messages: [err.message],
        severity: "error",
      });
    }
  };

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

      // setCertificates({ ...certificates, data.data });
      setCertificates([...certificates, data.data]);

      setShowForm(false);
      setReason("");
      setAgreeToTerms(false);
    } catch (err) {
      triggerToast({
        title: "Error",
        messages: [err.message],
        severity: "error",
      });
    }
  };

  const handleDownload = (certificateNumber) => {
    // TODO: implement download certificate
    console.log(`Downloading certificate ${certificateNumber}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatus = (cert) => {
    if (cert.state === "rejected") return "Rejected";
    if (cert.state === "approved") return "Approved";
    return "Pending";
  };

  const hasPendingCertificates = (certs) => {
    return (
      certs &&
      certs.some(
        (cert) => cert.state !== "approved" && cert.state !== "rejected"
      )
    );
  };

  return (
    <>
      <Box mt={4}>
        {hasPendingCertificates(certificates) ? null : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(!showForm)}
            sx={{ mb: 2 }}
          >
            {showForm ? "Cancel Request" : "Request New Certificate"}
          </Button>
        )}

        {showForm && !hasPendingCertificates(certificates) && (
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
            {certificates
              .sort((a, b) =>
                b.certificateNumber
                  .toString()
                  .localeCompare(a.certificateNumber.toString())
              )
              .map((cert) => (
                <TableRow key={cert.certificateNumber}>
                  <TableCell>{cert.certificateNumber}</TableCell>
                  <TableCell>{formatDate(cert.status.requestedAt)}</TableCell>
                  <TableCell>{getStatus(cert)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={cert.state !== "approved"}
                      onClick={() => handleDownload(cert.certificateNumber)}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
