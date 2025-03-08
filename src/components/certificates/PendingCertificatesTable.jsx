"use client";

import React, { useState, useEffect } from "react";
import {
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
import { DataGrid } from "@mui/x-data-grid";
import { approveCertificate } from "actions/certificates/approve/server_action";
import { rejectCertificate } from "actions/certificates/reject/server_action";
import { getFullUser } from "actions/users/get/full/server_action";

import { useToast } from "components/Toast";
import downloadCertificate from "components/certificates/CertificateDownloader";
import { ISOtoHuman } from "utils/formatTime";

const adminActions = {
    approve: approveCertificate,
    reject: rejectCertificate,
};

export default function PendingCertificatesTable({ pendingCerts }) {
    const { triggerToast } = useToast();
    const [processing, setProcessing] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        const fetchCertificates = async () => {
            const fetchedCertificates = await Promise.all(
                pendingCerts.map(async (cert) => {
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
            setCertificates(fetchedCertificates);
        };
        fetchCertificates();
    }, [pendingCerts]);

    const handleDownload = (e, certificateData) => {
        e.stopPropagation();
        downloadCertificate(certificateData);
    };

    const handleAction = async (certificateNumber, action) => {
        setProcessing(certificateNumber);
        try {
            const data = await adminActions[action](certificateNumber);
            if (data.ok) {
                triggerToast({
                    title: "Success",
                    messages: [`Certificate ${action}d successfully`],
                    severity: "success",
                });
                setCertificates((prev) =>
                    prev.filter((cert) => cert?.certificateNumber !== certificateNumber)
                );
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
        setSelectedCert(cert?.row);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedCert(null);
    };

    const clubColumns = [
        { field: "cid", headerName: "Club ID", flex: 1 },
        { field: "name", headerName: "Role", flex: 2 },
        { field: "startYear", headerName: "Start Year", flex: 1 },
        { field: "endYear", headerName: "End Year", flex: 1 },
    ];

    if (certificates.length === 0) {
        return (
            <Box textAlign="center" p={3}>
                <Typography variant="h6">
                    No pending certificate requests found.
                </Typography>
            </Box>
        );
    }

    const columns = [
        { field: "certificateNumber", headerName: "Certificate Number", flex: 1 },
        { field: "userFullName", headerName: "Student Name", flex: 1 },
        {
            field: "requestDate",
            headerName: "Request Date",
            flex: 1,
            renderCell: (params) => ISOtoHuman(params.row.status.requestedAt),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction(params?.row?.certificateNumber, "approve");
                        }}
                        disabled={
                            processing === params?.row?.certificateNumber ||
                            params?.row?.state === "approved"
                        }
                        sx={{ mr: 1 }}
                    >
                        {processing === params?.row?.certificateNumber ? (
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
                            handleAction(params?.row?.certificateNumber, "reject");
                        }}
                        disabled={
                            processing === params?.row?.certificateNumber ||
                            params?.row?.state === "approved"
                        }
                    >
                        {processing === params?.row?.certificateNumber ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Reject"
                        )}
                    </Button>
                </>
            ),
        },
        {
            field: "download",
            headerName: "Download",
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => handleDownload(e, params?.row)}
                    disabled={processing === params?.row?.certificateNumber}
                >
                    {processing === params?.row?.certificateNumber ? (
                        <CircularProgress size={24} />
                    ) : (
                        "Download"
                    )}
                </Button>
            ),
        },
    ];

    return (
        <>
            <DataGrid
                rows={certificates}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row.certificateNumber}
                onRowClick={handleRowClick}
            />

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Certificate Request Details</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight="bold">
                            Certificate Number:
                        </Typography>
                        <Typography>{selectedCert?.certificateNumber}</Typography>

                        <Typography variant="subtitle2" fontWeight="bold">
                            Student Name:
                        </Typography>
                        <Typography>{selectedCert?.userFullName}</Typography>

                        <Typography variant="subtitle2" fontWeight="bold">
                            Email:
                        </Typography>
                        <Typography>{selectedCert?.userEmail}</Typography>

                        <Typography variant="subtitle2" fontWeight="bold">
                            Roll Number:
                        </Typography>
                        <Typography>{selectedCert?.userRollno}</Typography>

                        <Typography variant="subtitle2" fontWeight="bold">
                            Batch:
                        </Typography>
                        <Typography>
                            {selectedCert?.userBatch} · {selectedCert?.userStream}
                        </Typography>

                        <Typography variant="subtitle2" fontWeight="bold">
                            Request Date:
                        </Typography>
                        <Typography>
                            {ISOtoHuman(selectedCert?.status?.requestedAt)}
                        </Typography>

                        <Typography variant="subtitle2" fontWeight="bold">
                            Request Reason:
                        </Typography>
                        <Typography>
                            {selectedCert?.requestReason || "No reason provided"}
                        </Typography>
                    </Box>
                    <Box mt={3}>
                        <Typography variant="h6">Clubs Membership</Typography>
                        <Paper style={{ height: 300, marginTop: 16 }}>
                            <DataGrid
                                rows={selectedCert?.certificateData
                                    ? JSON.parse(selectedCert?.certificateData)?.memberships
                                    : []}
                                columns={clubColumns}
                                pageSize={5}
                                getRowId={(row) => `${row.cid}-${row.startYear}`}
                                rowsPerPageOptions={[5, 10]}
                            />
                        </Paper>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="contained" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
