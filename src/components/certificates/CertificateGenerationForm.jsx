"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import { requestCertificate } from "actions/certificates/request/server_action";
import downloadCertificate  from "components/certificates/CertificateDownloader";
import { getFullUser } from "actions/users/get/full/server_action";

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

export default function CertificateGenerationForm({ Certificates = [] }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { triggerToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [userCertificates, setUserCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  const isFormValid = reason.trim() !== "" && agreeToTerms;
  useEffect(() => {
    const fetchCertificates = async () => {
        const fetchedCertificates = await Promise.all(
          Certificates.map(async (cert) => {
                const { data } = await getFullUser(cert?.userId);
                return {
                    ...cert,
                    userFullName: `${data?.firstName || "N/A"} ${data?.lastName || ""}`,
                    userEmail: data?.email || "N/A",
                    userRollno: data?.rollno || "N/A",
                    userBatch: data?.batch || "N/A",
                    userStream: data?.stream || "N/A",
                };
            })
        );
        setUserCertificates(fetchedCertificates);
      };
      fetchCertificates();
  }, [Certificates]);
  const handleCertificateRequest = async () => {
    try {
      const res = await requestCertificate(reason);

      if (!res.ok) {
        const errorData = res.error;
        throw new Error(
          errorData.error?.messages[0] || "Failed to request certificate"
        );
      }

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

  const handleDownload = (certificateData) => {
    downloadCertificate(certificateData);
  };

  const hasPendingCertificates = (certs) => {
    if (!certs || certs.length === 0) return false; // If no certificates exist, return true
  
    const fifteenDaysAgo = Date.now() - 15 * 24 * 60 * 60 * 1000;
    const hasRecentApproval = certs.some(
      (cert) =>
        cert.state === "approved" &&
        new Date(cert?.status?.requestedAt).getTime() >= fifteenDaysAgo
    );
  
    const hasPendingRequests = certs.some(
      (cert) => cert.state !== "approved" && cert.state !== "rejected"
    );
  
    return hasRecentApproval || hasPendingRequests;
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
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <Box>
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
              <Box component="form">
                <TextField
                  name="requestReason"
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
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!isFormValid}
                  style={{
                    opacity: isFormValid ? 1 : 0.5,
                    cursor: isFormValid ? "pointer" : "not-allowed",
                  }}
                  onClick={handleCertificateRequest}
                >
                  Submit Request
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                        handleDownload(cert);
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
      {userCertificates.length === 0 && (
        <Typography variant="h6" sx={{ mt: 2, textAlign: "center" }}>
            No certificates found
        </Typography>
        )}

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
          {selectedCert && selectedCert.state === "approved" && (
            <LoadingButton
              loading={loading}
              onClick={() => handleDownload(selectedCert)}
              color="primary"
              variant="contained"
            >
              Download
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
      </Box>
  );
}