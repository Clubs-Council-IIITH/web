"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  CircularProgress,
  Typography,
  Card,
  CardHeader,
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

export default function CertificateGenerationForm({
  userProfile,
  memberships,
}) {
  const [reason, setReason] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isPending, startTransition] = useTransition();
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
          data.error.messages[0] || "Failed to fetch certificates",
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
    if (!isFormValid) return;

    startTransition(async () => {
      try {
        let res = await fetch("/actions/certificates/request", {
          method: "POST",
          body: JSON.stringify({
            certificateInput: {
              requestReason: reason,
              memberships: memberships,
            },
          }),
        });
        res = await res.json();

        if (res.ok) {
          triggerToast({
            title: "Success!",
            messages: [
              "Certificate request submitted successfully. Please wait for approval.",
            ],
            severity: "success",
          });
          setShowForm(false);
          setReason("");
          setAgreeToTerms(false);
          fetchUserCertificates();
        } else {
          throw new Error(
            res.error.messages[0] || "Failed to request certificate",
          );
        }
      } catch (err) {
        triggerToast({
          title: "Error",
          messages: [err.message],
          severity: "error",
        });
      }
    });
  };

  const handleDownload = (certificateNumber) => {
    // TODO: implement download certificate
    console.log(`Downloading certificate ${certificateNumber}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        Certificates
      </Typography>
      <Card>
        <CardHeader
          title="User Details"
          titleTypographyProps={{ variant: "h5" }}
        />
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Typography>
              <strong>Name:</strong> {userProfile.firstName}{" "}
              {userProfile.lastName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {userProfile.email}
            </Typography>
            <Typography>
              <strong>Roll Number:</strong> {userProfile.rollno}
            </Typography>
            <Typography>
              <strong>Batch:</strong> {userProfile.batch}
            </Typography>
            <Typography>
              <strong>Stream:</strong> {userProfile.stream}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {userProfile.phone}
            </Typography>
          </div>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(!showForm)}
          sx={{ mb: 2 }}
        >
          {showForm ? "Cancel Request" : "Request New Certificate"}
        </Button>

        {showForm && (
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleCertificateRequest}>
                <TextField
                  name="reason"
                  label="Reason for Certificate Generation"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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
                  disabled={!isFormValid || isPending}
                  style={{
                    opacity: isFormValid && !isPending ? 1 : 0.5,
                    cursor:
                      isFormValid && !isPending ? "pointer" : "not-allowed",
                  }}
                >
                  {isPending ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Submit Request"
                  )}
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
            {certificates.map((cert) => (
              <TableRow key={cert.certificateNumber}>
                <TableCell>{cert.certificateNumber}</TableCell>
                <TableCell>
                  {new Date(cert.requestedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {cert.status === "approved" ? "Approved" : "Pending"}
                </TableCell>
                <TableCell>
                  {cert.status === "approved" ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownload(cert.certificateNumber)}
                    >
                      Download
                    </Button>
                  ) : (
                    <Button disabled variant="contained">
                      Download
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
