"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onClose,
  confirmProps = {},
  confirmText = "Confirm",
  addCancel = true,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText color="text.secondary">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {addCancel ? <Button onClick={onClose}>
          <Typography variant="button" color="text.disabled">
            Cancel
          </Typography>
        </Button> : null}
        <Button onClick={onConfirm} {...confirmProps}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
