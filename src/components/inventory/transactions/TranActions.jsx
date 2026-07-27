"use client";

import { useState } from "react";

import { Button } from "@mui/material";

import ConfirmDialog from "components/ConfirmDialog";
import Icon from "components/Icon";

/**
 * ApproveSloTransaction - Button to approve an SLO transaction.
 * - Shows a confirmation dialog before approving.
 * - Handles loading state during approval.
 */
export function ApproveSloTransaction({ sx, onClick }) {
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onClick?.();
    } finally {
      setLoading(false);
      setDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        startIcon={<Icon variant="done" />}
        onClick={() => setDialog(true)}
        disabled={loading}
        sx={sx}
      >
        Approve SLO
      </Button>

      <ConfirmDialog
        open={dialog}
        title="Approve this transaction?"
        description="This will move the transaction forward for SLO handling."
        onConfirm={handleApprove}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "success" }}
        confirmText="Yes, approve it"
      />
    </>
  );
}

export function TransactionRequest({ sx }) {
  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<Icon variant="add" />}
      sx={sx}
      disabled
    >
      Request
    </Button>
  );
}