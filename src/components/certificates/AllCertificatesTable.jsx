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
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { getFullUser } from "app/actions/users/get/full/server_action";
import { getAllCertificates } from "app/actions/certificates/all/server_action";
import { downloadCertificate } from "utils/certificateDownloader";

import Tag from "components/Tag";
import { useToast } from "components/Toast";
import { stateLabel } from "utils/formatCertificates";

const PAGE_SIZE = 10;

export default function AllCertificatesTable() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { triggerToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, [page]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllCertificates(page, PAGE_SIZE);

      if (data.ok) {
        const certificatesWithUserInfo = await Promise.all(
          data.data.certificates.map(async (cert) => {
            const userData = await getFullUser(cert.userId);
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
        setTotalPages(data.data.totalPages);
      } else {
        throw new Error(
          data.error?.messages?.[0] || "Failed to fetch certificates"
        );
      }
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setError(
        "An error occurred while fetching certificates. Please try again later."
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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDownload = (e, certificateNumber) => {
    e.stopPropagation();
    downloadCertificate(certificateNumber, triggerToast, setLoading);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
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
        <Button variant="contained" color="primary" onClick={fetchCertificates}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="all certificates table">
          <TableHead>
            <TableRow>
              <TableCell>Certificate Number</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certificates
              .map((cert) => ({
                ...cert,
                stateTag: stateLabel(cert.state),
              }))
              .sort((a, b) => b._id.localeCompare(a._id))
              .map((cert) => (
                <TableRow
                  key={cert._id}
                  onClick={() => handleRowClick(cert)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <TableCell>{cert.certificateNumber}</TableCell>
                  <TableCell>{cert.userFullName}</TableCell>
                  <TableCell>{formatDate(cert.status.requestedAt)}</TableCell>
                  <TableCell>
                    <Tag
                      label={cert.stateTag.name}
                      color={cert.stateTag.color}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={cert.state !== "approved"}
                      onClick={(e) => handleDownload(e, cert.certificateNumber)}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      ) : null}

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
              {selectedCert && formatDate(selectedCert.status.requestedAt)}
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
            <Button
              onClick={(e) => handleDownload(e, selectedCert.certificateNumber)}
              color="primary"
              variant="contained"
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
