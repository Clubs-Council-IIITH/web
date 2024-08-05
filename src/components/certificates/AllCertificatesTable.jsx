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
} from "@mui/material";
import { useToast } from "components/Toast";

const PAGE_SIZE = 10;

export default function AllCertificatesTable() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { triggerToast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, [page]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `/actions/certificates/all?page=${page}&PAGE_SIZE=${PAGE_SIZE}`
      );
      const data = await res.json();
      if (data.ok) {
        setCertificates(data.data.certificates);
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

  const handleDownload = (certificateNumber) => {
    window.open(
      `/actions/certificates/download?certificateNumber=${certificateNumber}`,
      "_blank"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
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
              <TableCell>User ID</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certificates.map((cert) => (
              <TableRow key={cert._id}>
                <TableCell>{cert.certificateNumber}</TableCell>
                <TableCell>{cert.userId}</TableCell>
                <TableCell>{formatDate(cert.status.requestedAt)}</TableCell>
                <TableCell>{cert.state}</TableCell>
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
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
