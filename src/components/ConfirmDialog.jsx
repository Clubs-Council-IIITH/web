"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onClose,
  confirmProps = {},
  confirmText = "Confirm",
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} {...confirmProps}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
