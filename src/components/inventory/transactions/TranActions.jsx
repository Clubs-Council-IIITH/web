"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

import ConfirmDialog from "components/ConfirmDialog";
import Icon from "components/Icon";
import { useToast } from "components/Toast";

import { approveSLOTransactionAction } from "actions/inventory/transactions/approve_slo/server_action";
import { approveClubTransactionAction } from "actions/inventory/transactions/approve_club/server_action";
import { rejectTransactionAction } from "actions/inventory/transactions/reject/server_action";
import { markBorrowedAction } from "actions/inventory/transactions/mark_borrowed/server_action";
import { returnTransactionAction } from "actions/inventory/transactions/return/server_action";
import { cancelTransactionAction } from "actions/inventory/transactions/cancel/server_action";
import { deleteTransactionAction } from "actions/inventory/transactions/delete/server_action";
import { submitTransactionAction } from "actions/inventory/transactions/submit/server_action";
import { logo_maxSizeMB, logo_warnSizeMB } from "components/clubs/ClubForm";
import FileUpload from "components/FileUpload";

// ---------------------------------------------------------------------------
// Submit (incomplete → pending / pending_slo)
// ---------------------------------------------------------------------------

export function SubmitTransaction({ tid, sx }) {
  const router = useRouter();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    const res = await submitTransactionAction(tid);
    setLoading(false);
    setDialog(false);
    if (res.ok) {
      triggerToast({ title: "Submitted!", messages: ["Transaction submitted for approval."], severity: "success" });
      router.refresh();
    } else {
      triggerToast({ ...res.error, severity: "error" });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="info"
        startIcon={<Icon variant="thumb-up-outline-rounded" />}
        onClick={() => setDialog(true)}
        disabled={loading}
        sx={sx}
      >
        Submit Request
      </Button>
      <ConfirmDialog
        open={dialog}
        title="Submit this transaction?"
        description="The request will be sent for approval."
        onConfirm={handle}
        onClose={() => setDialog(false)}
        confirmText="Yes, submit it"
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Club approval (pending_club → pending_slo)
// ---------------------------------------------------------------------------

export function ApproveClubTransaction({ tid, sx }) {
  const router = useRouter();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    const res = await approveClubTransactionAction(tid);
    setLoading(false);
    setDialog(false);
    if (res.ok) {
      triggerToast({ title: "Approved!", messages: ["Request forwarded to SLO."], severity: "success" });
      router.refresh();
    } else {
      triggerToast({ ...res.error, severity: "error" });
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
        Approve (Club)
      </Button>
      <ConfirmDialog
        open={dialog}
        title="Approve cross-club borrow?"
        description="This will forward the request to SLO for final approval."
        onConfirm={handle}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "success" }}
        confirmText="Yes, approve it"
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// SLO approval (pending_slo → approved_slo)
// ---------------------------------------------------------------------------

export function ApproveSloTransaction({ tid, sx }) {
  const router = useRouter();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  const handle = async () => {
    setLoading(true);
    const res = await approveSLOTransactionAction(tid, comment || null);
    setLoading(false);
    setDialog(false);
    if (res.ok) {
      triggerToast({ title: "Approved!", messages: ["Transaction approved by SLO."], severity: "success" });
      router.refresh();
    } else {
      triggerToast({ ...res.error, severity: "error" });
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
        Approve (SLO)
      </Button>

      <Dialog open={dialog} onClose={() => setDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Approve this transaction?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Optionally add a comment for the borrowing club.
          </DialogContentText>
          <TextField
            autoFocus
            label="SLO Comment (optional)"
            fullWidth
            multiline
            minRows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button onClick={handle} variant="contained" color="success" disabled={loading}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Reject (any pending → rejected)
// ---------------------------------------------------------------------------

export function RejectTransaction({ tid, sx }) {
  const router = useRouter();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handle = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    const res = await rejectTransactionAction(tid, reason);
    setLoading(false);
    setDialog(false);
    if (res.ok) {
      triggerToast({ title: "Rejected", messages: ["Transaction has been rejected."], severity: "warning" });
      router.refresh();
    } else {
      triggerToast({ ...res.error, severity: "error" });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<Icon variant="close" />}
        onClick={() => setDialog(true)}
        disabled={loading}
        sx={sx}
      >
        Reject
      </Button>

      <Dialog open={dialog} onClose={() => setDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reject this transaction?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejection.
          </DialogContentText>
          <TextField
            autoFocus
            label="Reason *"
            fullWidth
            multiline
            minRows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button
            onClick={handle}
            variant="contained"
            color="error"
            disabled={loading || !reason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Mark Borrowed (approved_slo → borrowed)
// ---------------------------------------------------------------------------

export function MarkBorrowed({ tid, sx }) {
  const router = useRouter();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [statusText, setStatusText] = useState("");

  const handle = async () => {
    setLoading(true);
    const res = await markBorrowedAction(tid, photoUrl || null, statusText || null);
    setLoading(false);
    setDialog(false);
    if (res.ok) {
      triggerToast({ title: "Marked as Borrowed!", messages: ["Item borrow confirmed."], severity: "success" });
      router.refresh();
    } else {
      triggerToast({ ...res.error, severity: "error" });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="info"
        startIcon={<Icon variant="check-circle-outline" />}
        onClick={() => setDialog(true)}
        disabled={loading}
        sx={sx}
      >
        Perform Borrow
      </Button>

      <Dialog open={dialog} onClose={() => setDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Confirm Item Borrow</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Provide item status/condition notes and an optional photo URL before borrowing.
          </DialogContentText>
          <Grid size={12}>
            <FileUpload
              type="image"
              name="Before Photo"
              label="Before Photo (optional)"
              control={(e) => setPhotoUrl(e.target.value)}
              maxFiles={1}
              shape="circle"
              maxSizeMB={photo_maxSizeMB}
              warnSizeMB={photo_warnSizeMB}
            />
          </Grid>
          <TextField
            label="Item Status / Condition Remarks (optional)"
            fullWidth
            multiline
            minRows={2}
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button onClick={handle} variant="contained" color="info" disabled={loading}>
            Confirm Borrow
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Return (borrowed → completed)
// ---------------------------------------------------------------------------

export function ReturnTransaction({ tid, sx }) {
  const router = useRouter();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const handle = async () => {
    setLoading(true);
    const res = await returnTransactionAction(tid, comment || null, photoUrl || null);
    setLoading(false);
    setDialog(false);
    if (res.ok) {
      triggerToast({ title: "Returned!", messages: ["Item successfully returned."], severity: "success" });
      router.refresh();
    } else {
      triggerToast({ ...res.error, severity: "error" });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        startIcon={<Icon variant="assignment-return" />}
        onClick={() => setDialog(true)}
        disabled={loading}
        sx={sx}
      >
        Perform Return
      </Button>

      <Dialog open={dialog} onClose={() => setDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Confirm Item Return</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Provide return notes and an optional after-condition photo URL upon return.
          </DialogContentText>
          <TextField
            label="After Photo URL (optional)"
            fullWidth
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Return Comment / Status Notes (optional)"
            fullWidth
            multiline
            minRows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button onClick={handle} variant="contained" color="success" disabled={loading}>
            Confirm Return
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------------
// Cancel (approved_slo → cancelled)
// ---------------------------------------------------------------------------

export function CancelTransaction({ tid, sx }) {
  const router = useRouter();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    const res = await cancelTransactionAction(tid);
    setLoading(false);
    setDialog(false);
    if (res.ok) {
      triggerToast({ title: "Cancelled", messages: ["Transaction has been cancelled."], severity: "warning" });
      router.push("/manage/inventory/transactions");
    } else {
      triggerToast({ ...res.error, severity: "error" });
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="warning"
        startIcon={<Icon variant="cancel" />}
        onClick={() => setDialog(true)}
        disabled={loading}
        sx={sx}
      >
        Cancel Request
      </Button>
      <ConfirmDialog
        open={dialog}
        title="Cancel this transaction?"
        description="The approved borrow request will be cancelled. This cannot be undone."
        onConfirm={handle}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "warning" }}
        confirmText="Yes, cancel it"
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Delete (soft delete, SLO / CC only)
// ---------------------------------------------------------------------------

export function DeleteTransaction({ tid, sx }) {
  const router = useRouter();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    const res = await deleteTransactionAction(tid);
    setLoading(false);
    setDialog(false);
    if (res.ok) {
      triggerToast({ title: "Deleted", messages: ["Transaction removed."], severity: "success" });
      router.push("/manage/inventory/transactions");
    } else {
      triggerToast({ ...res.error, severity: "error" });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<Icon variant="delete-forever-outline" />}
        onClick={() => setDialog(true)}
        disabled={loading}
        sx={sx}
      >
        Delete
      </Button>
      <ConfirmDialog
        open={dialog}
        title="Delete this transaction?"
        description="This action cannot be undone."
        onConfirm={handle}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "error" }}
        confirmText="Yes, delete it"
      />
    </>
  );
}